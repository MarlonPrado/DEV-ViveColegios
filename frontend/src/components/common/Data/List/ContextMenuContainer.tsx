import React from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';

const ContextMenuContainer = ({ onContextMenu, onContextMenuClick }: any) => {
  return (
    // <ContextMenu
    // id="context_menu"
    //   onShow={(e) => {
    //     return onContextMenu(e, e.detail.data);
    //   }}
    // >
    //   <MenuItem onClick={onContextMenuClick} data={{ action: 'copy' }}>
    //     <i className="simple-icon-docs" /> <span>Copy</span>
    //   </MenuItem>
    //   <MenuItem onClick={onContextMenuClick} data={{ action: 'move' }}>
    //     <i className="simple-icon-drawer" /> <span>Move to archive</span>
    //   </MenuItem>
    //   <MenuItem onClick={onContextMenuClick} data={{ action: 'delete' }}>
    //     <i className="simple-icon-trash" /> <span>Delete</span>
    //   </MenuItem>
    // </ContextMenu>
    <></>
  );
};

export default ContextMenuContainer;
