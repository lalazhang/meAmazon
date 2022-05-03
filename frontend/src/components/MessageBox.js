import { Alert } from 'react-bootstrap';
//Alert is not in react-bootstrap/Alert
function MessageBox(props) {
  return <Alert variant={props.variant}>{props.error}</Alert>;
}

export default MessageBox;
