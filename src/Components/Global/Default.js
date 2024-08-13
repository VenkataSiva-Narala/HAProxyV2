import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Select, Button, Divider, message,  } from "antd";
import IpAddress from '../../IPConfig';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

const { Option } = Select;

const Default = () => {
    const IP = IpAddress();
    const [form] = Form.useForm();
    const [Jsondata, setJsonData] = useState({});
    const navigate = useNavigate();


    useEffect(() => {
        // Update the screen width whenever the window is resized
        const handleResize = () => {
        };
        window.addEventListener('resize', handleResize);
        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const inputStyle = {
        fontWeight: '500',
        textAlign: 'left',
        fontSize: "12px",
        width: '100%',
        maxWidth: '200px',
    };

    const formItemStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',  // Align items to the left
        width: '100%',
        marginBottom: '20px',
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1300px',
        backgroundColor: '#fff',

    };

    const containerStyle = {
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#dee2e6',
       
    };

    const headerStyle = {
        position: 'relative',
        marginBottom: '20px',
        fontSize: '18px',
        fontWeight: 'bold',
    };

    const buttonGroupStyle = {
        display: 'flex',
         justifyContent: 'center',
        // textAlign: 'left',
        // marginTop: '20px',
    };

    const localStoragekey = localStorage.getItem('proToken');
    console.log("localStoragekeylocalStoragekey",localStoragekey);

    useEffect(() => {
		if (!localStoragekey) {
            console.log('Token:', localStoragekey);
			navigate('/')
		}
	}, [])
    // console.log("the token is ", localStoragekey)

    useEffect(() => {
       
        fetch(IP + "default", {
            headers: {
                "Authorization": localStoragekey
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("Jsondata", data)
                if (data.error === 0) {
                    setJsonData(data)
                    console.log("The data is", data);
                 
                } else if (data.error === 1) {
                    navigate('/');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [form]);

    console.log("Jsondata?.data?.data?.", Jsondata?.data?.data[0]?.client_timeout);

    useEffect(() => {
        form.setFieldsValue({ [`TimeoutConnect`]: Jsondata?.data?.data[0]?.connect_timeout })
        form.setFieldsValue({ [`TimeoutClient`]: Jsondata?.data?.data[0]?.client_timeout })
        form.setFieldsValue({ [`TimeoutServer`]: Jsondata?.data?.data[0]?.server_timeout })
        form.setFieldsValue({ [`httplog`]: Jsondata?.data?.data[0]?.httplog })
        // form.setFieldsValue({ [`IP Address`]: Jsondata?.data?.data?.runtime_apis[0].address })


    }, [Jsondata]);

    const handleSave = () => {
        form.validateFields()
            .then(values => {
             
                console.log('Saved values:', values);

                // Make a POST request to save the form data
                axios.post(IP + "save_default", values, {
                    headers: {
                        'Authorization': localStoragekey,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        console.log('Save response:', response);
                    
                        if (response.status === 200 && response.data.error === 0) {
                            message.success('Saved successfully!');
                        } else {
                            message.error('Save failed: ' + response.data.msg);
                        }
                    })
                    .catch(error => {
                        console.error('Save error:', error);
                       
                        message.error('An error occurred while saving.');
                    });
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    return (

        <div style={containerStyle}>
            <div style={{ display: 'flex', justifyContent: 'left', width: '100%' }}>
                <div style={{ width: '100%' }}>
                    <div style={{ marginBottom: '20px', border: '1px solid #d9d9d9', borderRadius: '4px', backgroundColor: '#fff', textAlign: 'left', paddingLeft: '40px' }}>
                        <Divider />
                        <div style={headerStyle}>
                            Default Section
                        </div>
                        <br />
                        {/* {fetchLoading ? (
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        ) : ( */}
                        <Form layout="vertical" style={formStyle}
                            form={form}
                        >
                            <Form.Item
                                name="TimeoutConnect"
                                label="Timeout Connect"
                                style={formItemStyle}
                            >
                                <InputNumber style={inputStyle} min={0} suffix="sec" />
                            </Form.Item>

                            <Form.Item
                                name="TimeoutClient"
                                label="Timeout Client"
                                style={formItemStyle}
                            >
                                <InputNumber style={inputStyle} min={0} suffix="sec" />
                            </Form.Item>

                            <Form.Item
                                name="TimeoutServer"
                                label="Timeout Server"
                                style={formItemStyle}
                            >
                                <InputNumber style={inputStyle} min={0} suffix="sec" />
                            </Form.Item>

                            <Form.Item
                                name="hTTPlog"
                                label="HTTP Log" style={formItemStyle}>
                                <Select style={{ fontWeight: '500', maxWidth: '200px', textAlign: 'left', fontSize: "12px", width: 150 }}
                                    defaultValue={"yes"}
                                >

                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item style={buttonGroupStyle}>
                                {/* <Button type="default" style={{ marginRight: '10px' }}>Previous</Button> */}
                                <Button type="primary" onClick={handleSave} style={{ marginLeft: '10px' }}>
                                    Save
                                </Button>
                                &nbsp;&nbsp;&nbsp;
                                <Button type="primary"  style={{ marginTop: '20px' }} 
                                    onClick={() => {
                                        fetch(IP + 'deploy_config', {
                                            headers: {
                                                'Authorization': localStoragekey,
                                            }
                                        })
                                            .then(response => {
                                                console.log("responseresponse", response);
                                                if (response.status === 200) {
                                                    message.success('Transaction Successful!');
                                                    fetch(IP + 'regenerate', {
                                                        headers: {
                                                            'Authorization': localStoragekey,
                                                        }
                                                    })
                                                    .then(response => {
                                                        console.log("Regenerate response:", response);
                                                        return response.json();
                                                    })
                                                        .then(data => {
                                                            console.log("responseresponse", data);
                                                            if (data.error === 0) {
                                                                const proToken = data.pro_token;
                                                                localStorage.setItem("proToken", proToken)
                                                                navigate("/home",);
                                                                console.log('regenerate Successful!');
                                                            } else if (data.error === 1) {
                                                                console.log("Unauthorized");
                                                            }
                                                        })
                                                        .catch(error => {
                                                            console.error('Error:', error);
                                                        });
                                                } else if (response.status === 401) {
                                                    message.info("Unauthorized");
                                                } else if (response.status === 204) {
                                                    console.error('Transaction not found or Dataplane is down.');
                                                } else {
                                                    console.error('Unexpected response status:', response.status);
                                                }
                                            })
                                            .catch(error => {
                                                console.error('Error:', error);
                                            });

                                           
                                    }}
                                    >
                                        Final Submit
                                </Button>
                            </Form.Item>
                        </Form>

                    </div>

                </div>

            </div>
        </div>

    );
};

export default Default;
