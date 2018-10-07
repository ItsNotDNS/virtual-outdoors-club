// This is information for webpack to know where we keep our test files
// src: https://www.toptal.com/react/how-react-components-make-ui-testing-easy
// authour: Swizec Teller
var context = require.context('./test');
context.keys().forEach(context);

// This code sets up the ability for us to use Enzyme for testing
// src: https://airbnb.io/enzyme/docs/installation/index.html
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });