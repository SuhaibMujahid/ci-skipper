const setup = require('../setup');
var option = process.argv[2];


switch(option){
	case "on": 
		setup.install()
		break;

	case "off":
		setup.uninstall()
		break;
	default:
	var help_msg = 'Usage:\n'
				 + '  ci-skipper on     setup the ci skipper for this git repository.\n'
				 + '  ci-skipper off    remove the ci skipper from this git repository.\n';
	console.log(help_msg);
}

