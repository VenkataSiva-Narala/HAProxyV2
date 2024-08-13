import React from 'react';
import { Form, Input, Button, Typography, Row, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from 'react';
import IpAddress from '../../IPConfig';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const { Title } = Typography;
const { Content } = Layout;

const LoginForm = () => {
    const IP = IpAddress();
   
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const onFinish = values => {
        console.log('Received values of form: ', values);
        const data = {
            username: values.username,
            password: values.password
        }
        const authHeader = 'Basic ' + btoa(values.username + ':' + values.password);
        axios.post(IP + "login_logic", data, {
            headers: {
                'Authorization': authHeader
            }
        })
            .then(response => {
                console.log("response", response);
                if (response.status === 200 && response.data.error === 0) {
                    const proToken = response.data.pro_token;
                    localStorage.setItem("proToken",proToken)
                    navigate("/home",);
                    // navigate("/default", { state: { proToken } });
                    // navigate("/backend", { state: { proToken } });

                } else {
                    setError("Invalid Credentials");
                }
            })
            .catch((error) => {
                console.error("Login error: ", error);
                setError("An error occurred during login.");
            });
    };

    return (
        <Layout className="layout">
            <Content className="content-container">
                <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
                    <div>
                        <div className="logo-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <img src="LoginPageLogo.png" alt="Protean Logo" style={{ width: '150px' }} />
                            <Title level={3} id="logoname">HA-PROXY APPLICATION CONFIGURATOR</Title>
                        </div>
                        <div className="panel border bg-white" style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Title level={3} className="font-weight-bold" style={{ textAlign: 'center' }}>Login</Title>
                            <Form
                                name="login"
                                className="login-form"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: 'Please enter your Username!' }]}
                                >
                                    <Input prefix={<UserOutlined />} placeholder="Enter your Username" />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Please enter your Password!' }]}
                                >
                                    <Input.Password prefix={<LockOutlined />} placeholder="Enter your Password" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button" block>
                                        Login
                                    </Button>
                                </Form.Item>
                                {error && (
                                    <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
                                )}
                            </Form>
                        </div>
                    </div>
                </Row>
            </Content>
        </Layout>
    );
};

export default LoginForm;
