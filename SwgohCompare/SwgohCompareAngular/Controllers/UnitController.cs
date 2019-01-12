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

        public UnitController(IMemoryCache memoryCache, IConfiguration configuration)
        {
            _cache = memoryCache;
            _testUsername = configuration["SwgohHelpAuth:username"];
            _testPassword = configuration["SwgohHelpAuth:password"];
        }
        [HttpGet("[action]")]
        public List<LocalizedUnit> UnitList()
        {
            return GetLocalizedUnits();
        }

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
                    .SetSlidingExpiration(TimeSpan.FromMinutes(5));

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
        private List<UnitDict> GetPlayerOneAndTwo(List<string> codesToRequest)
        {
            UnitDict PlayerOne;
            UnitDict PlayerTwo;
            
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
                        PlayerOne = SwgohHelper.fetchDictOfUnitsForPlayerFromCrinolo(code.ToString());
                        SetCacheValue(code, sourceCrinolo, PlayerOne);
                    }
                    else if (PlayerTwo == null)
                    {
                        PlayerTwo = SwgohHelper.fetchDictOfUnitsForPlayerFromCrinolo(code.ToString());
                        SetCacheValue(code, sourceCrinolo, PlayerTwo);
                    }
                }
            }
            return new List<UnitDict>() { PlayerOne, PlayerTwo };
        }

        /// <summary>
        /// Returns a list of units common to both ally codes passed in
        /// </summary>
        /// <param name="codes"></param>
        /// <returns></returns>
        [HttpPost("[action]")]
        public List<LocalizedUnit> UnitListForPlayers(IEnumerable<string> codes)
        {
            List<LocalizedUnit> localizedUnits;
            UnitDict PlayerOne;
            UnitDict PlayerTwo;
            
            var helper = Authenticate();

            localizedUnits = GetLocalizedUnits();

            var codesToRequest = new List<string>(codes);

            List<UnitDict> playerOneandTwo = GetPlayerOneAndTwo(codesToRequest);

            PlayerOne = playerOneandTwo[0];
            PlayerTwo = playerOneandTwo[1];

            var filteredPlayerUnits = PlayerOne.Where(x => PlayerTwo.Any(y => y.Key == x.Key));

            var filteredUnits = localizedUnits.Where(x => filteredPlayerUnits.Any(y => y.Key == x.BaseId));
            
            return filteredUnits.ToList();
        }

        [HttpPost("[action]")]
        public PlayerInformation GetUnitInformationForPlayers(List<string> comparisonInfo)
        {
            UnitDict PlayerOne;
            UnitDict PlayerTwo;

            Player PlayerOneHelp;
            Player PlayerTwoHelp;

            var helper = Authenticate();

            string unitDefId = comparisonInfo[2];
            //var helper = Authenticate();
            var codesToRequest = new List<string>() { comparisonInfo[0], comparisonInfo[1] };
            var codesToRequest2 = new List<string>() { comparisonInfo[0], comparisonInfo[1] };
            List<UnitDict> playerOneandTwo = GetPlayerOneAndTwo(codesToRequest);
            List<Player> playerOneandTwoHelp = GetPlayerOneAndTwoFromHelp(codesToRequest2);

            PlayerOne = playerOneandTwo[0];
            PlayerTwo = playerOneandTwo[1];

            PlayerOneHelp = playerOneandTwoHelp[0];
            PlayerTwoHelp = playerOneandTwoHelp[1];

            List<UnitData> unitDataToReturn = new List<UnitData>();
            List<Roster> rosterToReturn = new List<Roster>();

            unitDataToReturn.Add(PlayerOne.Where(x => x.Key == unitDefId).First().Value);
            unitDataToReturn.Add(PlayerTwo.Where(x => x.Key == unitDefId).First().Value);

            rosterToReturn.Add(PlayerOneHelp.Roster.Where(x => x.DefId == unitDefId).First());
            rosterToReturn.Add(PlayerTwoHelp.Roster.Where(x => x.DefId == unitDefId).First());

            PlayerInformation pinfo = new PlayerInformation() { PlayerNames = new List<string>() { PlayerOneHelp.Name, PlayerTwoHelp.Name }, UnitStatList = unitDataToReturn, RosterList = rosterToReturn, UnitInfo = helper.FetchGearTiersForUnits(unitDefId)[0].unitTierList };
            return pinfo;
        }

        // POST: api/Unit
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Unit/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
        
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

        private Dictionary<string, string> GetPlayerEntries(List<string> codes, string source)
        {
            var playerEntryList = new Dictionary<string, string>();
            playerEntryList.Add(string.Concat(codes[0], source), string.Concat(PlayerEntry, source, codes[0]));
            playerEntryList.Add(string.Concat(codes[0], source), string.Concat(PlayerEntry, source, codes[1]));
            return playerEntryList;
        }
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

    }
}
