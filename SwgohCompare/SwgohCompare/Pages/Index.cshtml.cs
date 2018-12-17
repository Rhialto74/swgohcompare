using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using SwgohHelpApi;
using SwgohHelpApi.Model;

namespace SwgohCompare.Pages
{
    public class IndexModel : PageModel
    {
        private const string testUsername = "Rhialto";
        private const string testPassword = "gm1oB4GCigeqyr0kB8G6APqjHk2DvoXXI4rfxXgo";
        SwgohHelper helper;

        public void OnGet()
        {
            //Initialize the helper
            helper = new SwgohHelper(new UserSettings() { Username = testUsername, Password = testPassword, Debug = "true" });
            helper.Login();

            //Make the request
            var reqOptions = new RequestOptions();
            reqOptions.allycodes = new List<int>() { 999531726, 362676873 };
            reqOptions.language = "eng_us";
            reqOptions.enums = true;
            Players = helper.fetchPlayers(reqOptions);
            UnitOne = Players[0].Roster.First();
            UnitTwo = Players[1].Roster.First();

            UnitNames = Players[0].Roster.Select(n => new SelectListItem { Value = n.Id, Text = n.NameKey }).OrderBy(e => e.Text).ToList();
        }

        [BindProperty]
        public int UnitId { get; set; }
        
        [BindProperty]
        public List<SelectListItem> UnitNames { get; set; }

        [BindProperty]
        public List<Player> Players { get; set; }

        [BindProperty]
        public Roster UnitOne { get; set; }

        [BindProperty]
        public Roster UnitTwo { get; set; }
    }
}
