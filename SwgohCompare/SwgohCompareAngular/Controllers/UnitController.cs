using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SwgohHelpApi;
using SwgohHelpApi.Model;

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

        private List<Player> GetPlayerOneAndTwo(List<int> codesToRequest)
        {
            Player PlayerOne;
            Player PlayerTwo;
            List<Player> players;
            int PlayerOneCode = codesToRequest[0];
            int PlayerTwoCode = codesToRequest[1];

            var dictPlayerEntries = GetPlayerEntries(codesToRequest);

            //Check if PlayerOne is in the cache
            if (_cache.TryGetValue(dictPlayerEntries[PlayerOneCode], out PlayerOne))
            {
                codesToRequest.Remove(PlayerOneCode);
            }

            //Check if PlayerTwo is in the cache
            if (_cache.TryGetValue(dictPlayerEntries[PlayerTwoCode], out PlayerTwo))
            {
                codesToRequest.Remove(PlayerTwoCode);
            }

            if (codesToRequest.Count > 0)
            {
                var options = new RequestOptions
                {
                    allycodes = codesToRequest,
                    language = "eng_us",
                    enums = true
                };
                
                var helper = Authenticate();
                players = helper.fetchPlayers(options);

                foreach (var code in codesToRequest)
                {
                    if (PlayerOne == null)
                    {
                        PlayerOne = players.Where(x => x.AllyCode == code).First();
                    }
                    else if (PlayerTwo == null)
                    {
                        PlayerTwo = players.Where(x => x.AllyCode == code).First();
                    }

                    SetCacheValue(dictPlayerEntries[code], players.Where(x => x.AllyCode == code).First());
                }
            }
            return new List<Player>() { PlayerOne, PlayerTwo };
        }

        /// <summary>
        /// Returns a list of units common to both ally codes passed in
        /// </summary>
        /// <param name="codes"></param>
        /// <returns></returns>
        [HttpPost("[action]")]
        public List<LocalizedUnit> UnitListForPlayers(IEnumerable<int> codes)
        {
            List<LocalizedUnit> localizedUnits;
            Player PlayerOne;
            Player PlayerTwo;
            
            var helper = Authenticate();

            localizedUnits = GetLocalizedUnits();

            var codesToRequest = new List<int>(codes);

            List<Player> playerOneandTwo = GetPlayerOneAndTwo(codesToRequest);

            PlayerOne = playerOneandTwo[0];
            PlayerTwo = playerOneandTwo[1];

            var filteredPlayerUnits = PlayerOne.Roster.Where(x => PlayerTwo.Roster.Any(y => y.DefId == x.DefId));

            var filteredUnits = localizedUnits.Where(x => filteredPlayerUnits.Any(y => y.DefId == x.BaseId));
            
            return filteredUnits.ToList();
        }

        [HttpPost("[action]")]
        public List<Roster> GetUnitInformationForPlayers(List<string> comparisonInfo)
        {
            Player PlayerOne;
            Player PlayerTwo;
            string unitDefId = comparisonInfo[2];
            var helper = Authenticate();
            var codesToRequest = new List<int>() { int.Parse(comparisonInfo[0]), int.Parse(comparisonInfo[1]) };

            List<Player> playerOneandTwo = GetPlayerOneAndTwo(codesToRequest);
            PlayerOne = playerOneandTwo[0];
            PlayerTwo = playerOneandTwo[1];

            List<Roster> rosterToReturn = new List<Roster>();

            rosterToReturn.Add(PlayerOne.Roster.Where(x => x.DefId == unitDefId).First());
            rosterToReturn.Add(PlayerTwo.Roster.Where(x => x.DefId == unitDefId).First());

            return rosterToReturn;
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
                SetCacheValue(HelperEntry, helper);
            }

            return helper;
        }

        private void CheckForCachedPlayers()
        {

        }
        private void SetCacheValue<T>(string key, T value)
        {
            // Set cache options.
            var cacheEntryOptions = new MemoryCacheEntryOptions()
            // Keep in cache for this time, reset time if accessed.
            .SetSlidingExpiration(TimeSpan.FromMinutes(5));

            _cache.Set(key, value);
        }

        private Dictionary<int, string> GetPlayerEntries(List<int> codes)
        {
            var playerEntryList = new Dictionary<int, string>();
            playerEntryList.Add(codes[0], string.Concat(PlayerEntry, codes[0]));
            playerEntryList.Add(codes[1], string.Concat(PlayerEntry, codes[1]));
            return playerEntryList;
        }

    }
}
