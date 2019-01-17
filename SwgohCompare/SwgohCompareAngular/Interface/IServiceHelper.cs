using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SwgohHelpApi;
using SwgohHelpApi.Model;

namespace SwgohCompareAngular.Interface
{
    public interface IServiceHelper
    {
        SwgohHelper Authenticate();

        void AuthenticateAsync();
    }


}
