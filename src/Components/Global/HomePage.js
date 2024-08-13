import React, { useState, useEffect } from 'react';
import { Layout, Typography, Collapse, message, Card, Tooltip, Alert } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';
import IpAddress from '../../IPConfig';

const { Title } = Typography;
const { Panel } = Collapse;
const { Content } = Layout;

const HomePage = () => {
    const IP = IpAddress();
    const [JsonData, setJsonData] = useState({});
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const [activeStatus, setActiveStatus] = useState('');
    const [runningSince, setRunningSince] = useState('');
    const [logsText, setLogsText] = useState('');
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    // console.log('localStorage this',localStorage.getItem('proToken'));
    const localStoragekey = localStorage.getItem('proToken');
    console.log("localStoragekeylocalStoragekey", localStoragekey);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        if (!localStoragekey) {
            console.log('Token:', localStoragekey);
            navigate('/')
        }
    }, [])
    useEffect(() => {
        fetch(IP + "ha_proxy_status", {
            headers: {
                "Authorization": localStoragekey
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data);
                if (data.error === 0) {
                    setJsonData(data)
                    setActiveStatus(data.status || 'N/A');
                    setRunningSince(data.running_since || 'N/A');
                    setLogsText(data.log_text || 'No logs available');
                } else if (data.error === 1) {
                    navigate('/');
                }
            })
            .catch(error => {
                console.error('Error fetching stats:', error);
                message.error('Failed to fetch stats.');
            });
    }, []);
    console.log("INLOOPstatsjsondata", JsonData)
    const getStatusIcon = () => {
        console.log("activeStatus", activeStatus);
        switch (activeStatus) {
            case activeStatus.includes('active'):
                return (
                    <Tooltip title="Service is active">
                        <CheckCircleOutlined style={{ color: 'green', fontSize: '24px' }} />
                    </Tooltip>
                );
            case activeStatus.includes('in active'):
                return (
                    <Tooltip title="Service is stopped">
                        <CloseCircleOutlined style={{ color: 'red', fontSize: '24px' }} />
                    </Tooltip>
                );
            case activeStatus.includes('None'):
                return (
                    <Tooltip title="Service is inactive">
                        <WarningOutlined style={{ color: 'orange', fontSize: '24px' }} />
                    </Tooltip>
                );
            default:
                return null;
        }
    };
    return (
        <Layout>
            <Content style={{ padding: '50px' }}>
                <div className="status-container">
                    <div className="status">
                        <span className="status-label">Status:</span>
                        <span className="status-value" id="activeStatus">
                            {getStatusIcon()}
                            <span style={{
                                marginLeft: '8px',
                                color: 'green', 
                                fontWeight: 'bold'
                            }}>
                                {activeStatus}</span>
                        </span>
                        <span className="status-value1">{runningSince}</span>
                        <br />
                        <br />
                        <hr />
                        <div style={{ width: screenWidth < 700 ? "10cm" : screenWidth > 700 ? "25cm" : '' }}>
                            <Collapse accordion >
                                <Panel header="Service-Logs >>>" key="1">
                                    <Card>
                                        <pre><code>{logsText}</code></pre>
                                    </Card>
                                </Panel>
                            </Collapse>
                        </div>
                        <br />
                        <div>
                            <Title level={5}>NOTE:</Title>
                            <Typography.Paragraph>
                                1. All the configuration changes to HAProxy are based on the current running version
                                of the HAProxy configuration file located at /etc/haproxy/haproxy.cfg.
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                                2. Please explicitly commit the changes by pressing the Final Submit button during
                                configuration changes.
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                                3. Temporary uncommitted changes will be lost post re-login.
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                                4. Changes can be carried out with an OS user with sudo privileges.
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                                5. The portal provides a feature to view the error logs in case of any
                                misconfiguration in HAProxy. The feature is available in the menu options.
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                                6. Refer to the SOP in the help section for configuring HAProxy from GUI. Click here to
                                view.
                            </Typography.Paragraph>
                        </div>
                    </div>
                </div>
                {messages.length > 0 && messages.map((message, index) => (
                    <Alert key={index} message={message} type="info" showIcon />
                ))}
            </Content>
        </Layout>
    );
};

export default HomePage;
