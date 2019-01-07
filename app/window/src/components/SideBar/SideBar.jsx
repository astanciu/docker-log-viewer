import React from 'react';
import { get } from 'lodash';
import { Button, Icon } from 'semantic-ui-react';

export class SideBar extends React.Component {
  state = {
    width: null,
    selected: ''
  }
  componentWillMount(){
    let width = 200
    this.setState({width})
  }
  resizeDragMouseDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    document.addEventListener('mousemove', this.resizeMouseMove)
    document.addEventListener('mouseup', this.resizeDragMouseUp)
  }
  resizeMouseMove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let width = e.pageX
    if (width < 200) width = 200
    if (width > 400) width = 400
    this.setState({width})
  }
  resizeDragMouseUp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // console.log('Mouse Up', e.target)
    document.removeEventListener('mousemove', this.resizeMouseMove)
    document.removeEventListener('mouseup', this.resizeDragMouseUp)
  }


  selectContainer = id => this.setState({selected: id})
  render() {
    const list = this.props.containers.map(c => (
      <SideBarItem 
        container={c} 
        view={this.props.view} 
        key={c.Id} 
        onSelect={this.selectContainer}
        selected={this.state.selected === c.Id}
      />
    ));
    return (
      <div className="side-bar" style={{width: this.state.width}}>
       <div id="dragbar" 
       onMouseDown={this.resizeDragMouseDown} />
        <div className="side-bar-content">
          <div className="side-bar-header">Containers</div>
          <div className="container-list">{list}</div>
        </div>
      </div>
    );
  }
}

const SideBarItem = ({ container, view, onSelect, selected }) => {
  const name = get(container, 'Names')[0].replace('/', '');
  const follow = (e)=> {
    console.log('Follow ', name)
    e.stopPropagation()
  }

  const viewLogs = () => {
    onSelect(container.Id)
    view(name)
  }

  return (
    <div className={`container ${selected && 'selected'}`} onClick={viewLogs}>
      <div className="container-name">{name}</div>
     <Icon name='eye' size='large' onClick={follow} />
    </div>
  );
};
