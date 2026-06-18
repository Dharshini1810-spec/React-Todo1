import React from "react";
import { Layout, Typography, Space } from "antd";
import { CarryOutOutlined } from "@ant-design/icons";
import "./Header.css";

const { Header: AntHeader } = Layout;
const { Title, Paragraph } = Typography;

export default function Header() {
  return (
    <AntHeader className="dashboard-header">
      <div className="header-container">
        <Space align="center" size={16} className="logo-space">
          <div className="logo-icon-wrapper">
            <CarryOutOutlined className="logo-icon" />
          </div>
          <div>
            <Title level={2} className="gradient-title" style={{ margin: 0 }}>
              TaskFlow
            </Title>
            <Paragraph className="header-subtitle" style={{ margin: 0 }}>
              Smart CRUD Task Management & Analytics Dashboard
            </Paragraph>
          </div>
        </Space>
      </div>
    </AntHeader>
  );
}
