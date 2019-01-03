import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

type SandboxProps = RouteComponentProps<{}> & {};
type SandboxState = {};

class Sandbox extends React.Component<SandboxProps, SandboxState> {
  constructor(props: SandboxProps) {
    super(props);

    this.state = {};
  }

  render() {
    return <div className="default-container">Hello world!</div>;
  }
}

export default Sandbox;
