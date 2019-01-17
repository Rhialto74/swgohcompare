using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SwgohHelpApi;
using SwgohHelpApi.Model;
using SwgohCompareAngular.Interface;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;

namespace SwgohCompareAngular.Services
{
    public class ServiceHelper : IServiceHelper
    {
        private string HelperEntry = "_Helper";

        private string _testUsername;
        private string _testPassword;
        private IMemoryCache _cache;

        private const string sourceHelp = "SWGOHHELP";
        private const string sourceCrinolo = "CRINOLO";
        private const string sourceGg = "GG";

        public ServiceHelper(IMemoryCache memoryCache, IConfiguration configuration)
        {
            _cache = memoryCache;
            _testUsername = configuration["SwgohHelpAuth:username"];
            _testPassword = configuration["SwgohHelpAuth:password"];
        }
        public SwgohHelper Authenticate()
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

        public async void AuthenticateAsync()
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
