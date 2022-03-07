import { Layout } from 'antd';
import CalculateForm from './components/CalculateForm'
import './App.css';

const { Header, Content } = Layout;

function App() {
  return (
    <Layout className="main">
      <Header className="header"></Header>        
        <Content><CalculateForm/></Content>
    </Layout>
  );
}

export default App;
