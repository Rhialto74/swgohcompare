using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SwgohHelpApi;
using SwgohHelpApi.Model;
using SwgohHelpApi.Model.Crinolo;

namespace SwgohCompareAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnitController : ControllerBase
    {
        private string _testUsername;
        private string _testPassword;
        private IMemoryCache _cache;
        private static string LocalUnitEntry = "_LocalizedUnits";
        private static string PlayerEntry = "_Player";
        private static string HelperEntry = "_Helper";

        private const string sourceHelp = "SWGOHHELP";
        private const string sourceCrinolo = "CRINOLO";
        private const string sourceGg = "GG";

        private readonly ILogger _logger;

        public UnitController(IMemoryCache memoryCache, IConfiguration configuration, ILogger<UnitController> logger)
        {
            _cache = memoryCache;
            _testUsername = configuration["SwgohHelpAuth:username"];
            _testPassword = configuration["SwgohHelpAuth:password"];
            _logger = logger;
        }

        #region --- Public Endpoint Methods ---
        

        /// <summary>
        /// Returns a list of units common to both ally codes passed in
        /// </summary>
        /// <param name="codes"></param>
        /// <returns></returns>
        [HttpPost("[action]")]
        public List<LocalizedUnit> UnitListForPlayers(IEnumerable<string> codes)
        {
            try
            {
                List<LocalizedUnit> localizedUnits;
                List<UnitWithStat> PlayerOne;
                List<UnitWithStat> PlayerTwo;

                var helper = Authenticate();

                localizedUnits = GetLocalizedUnits();

                var codesToRequest = new List<string>(codes);

                var players = Task.Run(() =>
                {
                    GetPlayerOneAndTwoFromHelp(codesToRequest);
                });

                List<List<UnitWithStat>> playerOneandTwo = GetPlayerOneAndTwo(codesToRequest);

                PlayerOne = playerOneandTwo[0];
                PlayerTwo = playerOneandTwo[1];

                var filteredPlayerUnits = PlayerOne.Where(x => PlayerTwo.Any(y => y.DefId == x.DefId));

                var filteredUnits = localizedUnits.Where(x => filteredPlayerUnits.Any(y => y.DefId == x.BaseId));

                return filteredUnits.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogCritical(LoggingEvents.UnitListForPlayers, ex, "UnitListForPlayers Exception");
                return new List<LocalizedUnit>();
            }
        }

        [HttpPost("[action]")]
        public PlayerInformation GetUnitInformationForPlayers(List<string> comparisonInfo)
        {
            try
            {
                List<UnitWithStat> PlayerOne;
                List<UnitWithStat> PlayerTwo;

                Player PlayerOneHelp;
                Player PlayerTwoHelp;

                var helper = Authenticate();

                string unitDefId = comparisonInfo[2];
                //var helper = Authenticate();
                var codesToRequest = new List<string>() { comparisonInfo[0], comparisonInfo[1] };
                var codesToRequest2 = new List<string>() { comparisonInfo[0], comparisonInfo[1] };
                List<List<UnitWithStat>> playerOneandTwo = GetPlayerOneAndTwo(codesToRequest);
                List<Player> playerOneandTwoHelp = GetPlayerOneAndTwoFromHelp(codesToRequest2);

                PlayerOne = playerOneandTwo[0];
                PlayerTwo = playerOneandTwo[1];

                PlayerOneHelp = playerOneandTwoHelp[0];
                PlayerTwoHelp = playerOneandTwoHelp[1];

                List<UnitWithStat> unitDataToReturn = new List<UnitWithStat>();
                List<Roster> rosterToReturn = new List<Roster>();

                unitDataToReturn.Add(PlayerOne.Where(x => x.DefId == unitDefId).First());
                unitDataToReturn.Add(PlayerTwo.Where(x => x.DefId == unitDefId).First());

                rosterToReturn.Add(PlayerOneHelp.Roster.Where(x => x.DefId == unitDefId).First());
                rosterToReturn.Add(PlayerTwoHelp.Roster.Where(x => x.DefId == unitDefId).First());

                PlayerInformation pinfo = new PlayerInformation() { PlayerNames = new List<string>() { PlayerOneHelp.Name, PlayerTwoHelp.Name }, UnitStatList = unitDataToReturn, RosterList = rosterToReturn, UnitInfo = helper.FetchGearTiersForUnits(unitDefId)[0].unitTierList };
                return pinfo;
            }
            catch (Exception ex)
            {
                _logger.LogCritical(LoggingEvents.GetUnitInformationForPlayers, ex, "GetUnitInformationForPlayers Exception");
                return new PlayerInformation();
            }
        }

        #endregion
        
        #region --- External API Calls ---
        
        private List<LocalizedUnit> GetLocalizedUnits()
        {
            List<LocalizedUnit> localizedUnits;

            if (!_cache.TryGetValue(LocalUnitEntry, out localizedUnits))
            {
                // Key not in cache, so get data.
                //Initialize the helper
                var helper = Authenticate();

                localizedUnits = helper.FetchLocalizedUnits().OrderBy(e => e.NameKey).ToList();

                // Set cache options.
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    // Keep in cache for this time, reset time if accessed.
                    .SetSlidingExpiration(TimeSpan.FromMinutes(20));

                // Save data in cache.
                _cache.Set(LocalUnitEntry, localizedUnits);
            }
            return localizedUnits;
        }

        private List<Player> GetPlayerOneAndTwoFromHelp(List<string> codesToRequest)
        {
            Player PlayerOne;
            Player PlayerTwo;
            List<Player> players;

            string PlayerOneCode = codesToRequest[0];
            string PlayerTwoCode = codesToRequest[1];

            //Check if PlayerOne is in the cache
            if (GetCacheValue(PlayerOneCode, sourceHelp, out PlayerOne))
            {
                codesToRequest.Remove(PlayerOneCode);
            }

            //Check if PlayerTwo is in the cache
            if (GetCacheValue(PlayerTwoCode, sourceHelp, out PlayerTwo))
            {
                codesToRequest.Remove(PlayerTwoCode);
            }

            var options = new RequestOptions
            {
                allycodes = new List<int>() { int.Parse(PlayerOneCode), int.Parse(PlayerTwoCode) },
                language = "eng_us",
                enums = true
            };

            if (codesToRequest.Count > 0)
            { 
                var helper = Authenticate();
                players = helper.fetchPlayers(options);

                foreach (var code in codesToRequest)
                {
                    if (PlayerOne == null)
                    {
                        PlayerOne = players.Where(x => x.AllyCode.ToString() == code).First();
                    }
                    else if (PlayerTwo == null)
                    {
                        PlayerTwo = players.Where(x => x.AllyCode.ToString() == code).First();
                    }

                    SetCacheValue(code, sourceHelp, players.Where(x => x.AllyCode.ToString() == code).First());
                }
            }
            return new List<Player>() { PlayerOne, PlayerTwo };
        }

        private async Task<List<Player>> GetPlayerOneAndTwoFromHelpAsync(List<string> codesToRequest)
        {
            Player PlayerOne;
            Player PlayerTwo;
            List<Player> players;

            string PlayerOneCode = codesToRequest[0];
            string PlayerTwoCode = codesToRequest[1];

            //Check if PlayerOne is in the cache
            if (GetCacheValue(PlayerOneCode, sourceHelp, out PlayerOne))
            {
                codesToRequest.Remove(PlayerOneCode);
            }

            //Check if PlayerTwo is in the cache
            if (GetCacheValue(PlayerTwoCode, sourceHelp, out PlayerTwo))
            {
                codesToRequest.Remove(PlayerTwoCode);
            }

            var options = new RequestOptions
            {
                allycodes = new List<int>() { int.Parse(PlayerOneCode), int.Parse(PlayerTwoCode) },
                language = "eng_us",
                enums = true
            };

            if (codesToRequest.Count > 0)
            {
                var helper = Authenticate();
                var returnVal = await helper.fetchPlayersAsync(options);

                players = JsonConvert.DeserializeObject<List<Player>>(returnVal);
                foreach (var code in codesToRequest)
                {
                    if (PlayerOne == null)
                    {
                        PlayerOne = players.Where(x => x.AllyCode.ToString() == code).First();
                    }
                    else if (PlayerTwo == null)
                    {
                        PlayerTwo = players.Where(x => x.AllyCode.ToString() == code).First();
                    }

                    SetCacheValue(code, sourceHelp, players.Where(x => x.AllyCode.ToString() == code).First());
                }
            }
            return new List<Player>() { PlayerOne, PlayerTwo };
        }
        private List<List<UnitWithStat>> GetPlayerOneAndTwo(List<string> codesToRequest)
        {
            List<UnitWithStat> PlayerOne;
            List<UnitWithStat> PlayerTwo;
            
            string PlayerOneCode = codesToRequest[0];
            string PlayerTwoCode = codesToRequest[1];

            //Check if PlayerOne is in the cache
            if (GetCacheValue(PlayerOneCode, sourceCrinolo, out PlayerOne))
            {
                codesToRequest.Remove(PlayerOneCode);
            }

            //Check if PlayerTwo is in the cache
            if (GetCacheValue(PlayerTwoCode, sourceCrinolo, out PlayerTwo))
            {
                codesToRequest.Remove(PlayerTwoCode);
            }

            if (codesToRequest.Count > 0)
            {
                foreach (var code in codesToRequest)
                {
                    if (PlayerOne == null)
                    {
                        PlayerOne = SwgohHelper.fetchListOfUnitsForPlayerFromCrinolo(code.ToString());
                        SetCacheValue(code, sourceCrinolo, PlayerOne);
                    }
                    else if (PlayerTwo == null)
                    {
                        PlayerTwo = SwgohHelper.fetchListOfUnitsForPlayerFromCrinolo(code.ToString());
                        SetCacheValue(code, sourceCrinolo, PlayerTwo);
                    }
                }
            }
            return new List<List<UnitWithStat>>() { PlayerOne, PlayerTwo };
        }

        #endregion

        #region --- Authentication ---

        private SwgohHelper Authenticate()
        {
            SwgohHelper helper;

            if (!_cache.TryGetValue(HelperEntry, out helper))
            {
                helper = new SwgohHelper(new UserSettings() { Username = _testUsername, Password = _testPassword, Debug = "true" });
                helper.Login();
                SetCacheValue(HelperEntry, sourceHelp, helper);
            }

            return helper;
        }

        private async void AuthenticateAsync()
        {
            SwgohHelper helper;
            
            if (_cache.TryGetValue(HelperEntry, out helper))
            {
                return;
            }
            else
            {
                await Task.Run(() =>
                {
                    helper = new SwgohHelper(new UserSettings() { Username = _testUsername, Password = _testPassword, Debug = "true" });
                    helper.Login();
                    SetCacheValue(HelperEntry, sourceHelp, helper);
                }
                );
                
            }
        }

        #endregion

        #region --- Caching ---

        private void SetCacheValue<T>(string key, string source, T value)
        {
            // Set cache options.
            var cacheEntryOptions = new MemoryCacheEntryOptions()
            // Keep in cache for this time, reset time if accessed.
            .SetSlidingExpiration(TimeSpan.FromMinutes(5));

            _cache.Set(string.Concat(key, source), value);
        }

        private bool GetCacheValue<T>(string item, string source, out T cachedItem)
        {
            string combinedKey = string.Concat(item, source);
            if (_cache.TryGetValue(combinedKey, out T returnedItem))
            {
                cachedItem = returnedItem;
                return true;
            }
            else
            {
                cachedItem = default(T);
                return false;
            }
        }


        #endregion

    }
}
