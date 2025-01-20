import React, { useState } from "react";
import { Menu, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";

export default function FloatingMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      {/* Botão flutuante */}
      <Button
        type="primary"
        icon={<MenuOutlined />}
        onClick={toggleMenu}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1000,
        }}
      />
      {/* Menu Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={toggleMenu}
        open={isMenuOpen}
      >
        <Menu mode="vertical">
          <Menu.Item key="1">Opção 1</Menu.Item>
          <Menu.Item key="2">Opção 2</Menu.Item>
          <Menu.Item key="3">Opção 3</Menu.Item>
        </Menu>
      </Drawer>
    </div>
  );
}
