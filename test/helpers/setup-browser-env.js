import browserEnv from 'browser-env';
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

browserEnv();

global.SVGElement = global.Element;

enzyme.configure({
  adapter: new Adapter()
});
