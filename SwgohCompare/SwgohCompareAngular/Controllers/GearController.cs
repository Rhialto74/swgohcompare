using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SwgohHelpApi;
using SwgohHelpApi.Model.Gg;
using Newtonsoft.Json;

namespace SwgohCompareAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GearController : ControllerBase
    {
        [HttpPost("[action]")]
        public Gear GetSpecificGear(string code)
        {
            return JsonConvert.DeserializeObject<Gear>(SwgohHelper.fetchSpecificGearFromSwgohGGApi(code));
        }

        [HttpGet("[action]")]
        public List<Gear> GetAllGear()
        {
            return JsonConvert.DeserializeObject<List<Gear>>(SwgohHelper.fetchAllGearFromSwgohGGApi());
        }
    }
}