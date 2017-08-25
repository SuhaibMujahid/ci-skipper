const setup = require('../setup');
const analyser = require('../analyser');
var option = process.argv[2];


switch(option){
	case "on": 
		setup.install();
		break;

	case "off":
		setup.uninstall();
		break;

	case "analysis":
		analyser();
		break;

	default:
	var help_msg = 'Usage:\n'
				 + '  ci-skipper on     enable CI Skipper for this git repository.\n';
				 + '  ci-skipper off    disable CI Skipper from this git repository.\n';
	console.log(help_msg);
}

