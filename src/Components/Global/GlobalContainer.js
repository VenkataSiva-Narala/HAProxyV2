import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select,  Row, Col, } from 'antd';
import '../CssFolder/StyleCss.css';
import IpAddress from '../../IPConfig';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

const { Option } = Select;

const GlobalContainer = () => {
    const IP = IpAddress();
    const [showMaxMinVersions, setShowMaxMinVersions] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [form] = Form.useForm();
    const [Jsondata, setJsonData] = useState({});   
    const navigate = useNavigate(); 

    const handleSubmit = (values) => {
        console.log('Form values: ', values);
        message.success('Form submitted');
    };


    const localStoragekey = localStorage.getItem('proToken');
    console.log("localStoragekeylocalStoragekey",localStoragekey);

    useEffect(() => {
		if (!localStoragekey) {
			navigate('/')
		}
	}, [])
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

   
    const handleTlsSecurityChange = (value) => {
        if (value === 'Allow') {
            setShowMaxMinVersions(true);
            form.setFieldsValue({ [`tlsSecurity`]: "Allow" });
        } else {
            setShowMaxMinVersions(false);
            form.setFieldsValue({ maxVersion: '', minVersion: '' });
        }
    };
    // console.log("Jsondata is this",Jsondata.data.data)
    useEffect(() => {
        fetch(IP + "global", {
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
                    // navigate('/');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [form]);

    useEffect(() => {
        console.log("thejsondata===>", Jsondata?.data?.data);
        form.setFieldsValue({ [`maxconn`]: parseInt(Jsondata?.data?.data?.maxconn) })

        const maxVersion = Jsondata?.data?.data?.runtime_apis?.[0]?.ssl_max_ver ?? '';
        const minVersion = Jsondata?.data?.data?.runtime_apis?.[0]?.ssl_min_ver ?? '';

        form.setFieldsValue({
            maxVersion: maxVersion,
            minVersion: minVersion
        });
        if (maxVersion && minVersion) {
            form.setFieldsValue({ tlsSecurity: "Allow" });
            setShowMaxMinVersions(true);
        } else {
            form.setFieldsValue({ tlsSecurity: "" });
        }
        form.setFieldsValue({
            // maxVersion: Jsondata?.data?.data?.runtime_apis?.[0]?.ssl_max_ver ?? '',
            // minVersion: Jsondata?.data?.data?.runtime_apis?.[0]?.ssl_min_ver ?? '',
            ciphers: Jsondata?.data?.data?.runtime_apis?.[0]?.ciphers ?? '',
            IPAddress: Jsondata?.data?.data?.runtime_apis?.[0]?.address ?? ''
        });

    }, [Jsondata]);
    // {
    //     "data": {
    //       "maxconn": 2000,
    //       "runtime_apis": [
    //         {
    //           "address": "ThisIsAValidString",
    //           "ciphers": "kjhvfk",
    //           "ssl_max_ver": "TLSv1.0",
    //           "ssl_min_ver": "SSLv3"
    //         }
    //       ],
    //       "wurfl_options": {}
    //     },
    //     "dp_status": 202,
    //     "error": 0,
    //     "msg": "Changes Saved"
    //   }
    const onFinish = (values) => {
        console.log('Received values:', values);
        // var MainSavejsondata = {}

        // for (let i = 0; i < Jsondata?.data.data.length; i++) {
        console.log("MainSavejsondata".Jsondata?.data)
        var globaldata = {

            maxconn: parseInt(form.getFieldValue(`maxconn`)),
            runtime_apis: [
                {
                    address: form.getFieldValue(`IPAddress`),
                    ciphers: form.getFieldValue(`ciphers`),
                    ssl_max_ver: form.getFieldValue(`maxVersion`),
                    ssl_min_ver: form.getFieldValue(`minVersion`),

                }
            ]

        }
        // MainSavejsondata.push(globaldata);
        console.log('MainSavejsondata:', globaldata);


        // Make a POST request to save the form data
        axios.post(IP + "save_global", globaldata, {
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

    };

    // console.log("Jsondata?.data?.data?.maxconn", Jsondata?.data?.data && Jsondata?.runtime_apis?.data)

    return (

        <div
            style={{
                padding: "20px",
                backgroundColor: "#dee2e6",
                minHeight: "100vh",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "100%",
                    height: "100vh",
                    maxHeight: "100vh",
                }}
            >
                <div
                    style={{
                        marginBottom: "20px",
                        border: "1px solid #d9d9d9",
                        borderRadius: "4px",
                        backgroundColor: "#fff",
                        padding: "20px",
                    }}
                >
                    <div
                        style={{
                            marginBottom: "20px",
                            fontSize: "18px",
                            fontWeight: "bold",
                        }}
                    >
                        Global Section
                    </div>
                    {/* {fetchLoading ? (
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        ) : ( */}
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                        style={{ maxWidth: "600px", width: "100%" }}
                    >
                        <Form.Item
                            name="maxconn"
                            className='inline-form-item'
                            label={<span style={{ marginBottom: "20px" }}>Max Connection <a style={{ color: "red" }}>*</a></span>}
                        >
                            <Input

                                style={{
                                    fontWeight: "500",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    width: "100%",
                                    maxWidth: screenWidth > 1000 ? "400px" : "300px",
                                }}

                                type="number" />

                        </Form.Item>

                        <Form.Item
                            name="tlsSecurity"
                            label="TLS Security:"
                            style={{ marginBottom: "20px" }}
                        >
                            <Select
                                style={{
                                    fontWeight: "500",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    width: "100%",
                                    maxWidth: screenWidth > 1000 ? "400px" : "300px",
                                }}
                                placeholder="Select TLS Security"
                                onChange={handleTlsSecurityChange}
                            >
                                <Option value="No Action">No Action</Option>
                                <Option value="Allow">Allow</Option>
                                <Option value="Block">Block</Option>
                            </Select>
                        </Form.Item>
                        {/* {tlsSecurity === 'Allow' && ( */}
                        {showMaxMinVersions && (
                            < Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="maxVersion"
                                        label="Max Version:"
                                        style={{
                                            marginBottom: "20px",
                                            width: "100%",
                                            maxWidth: "300px",
                                        }}
                                    >
                                        <Select
                                            style={{
                                                fontWeight: "500",
                                                textAlign: "left",
                                                fontSize: "12px",
                                                width: "100%",
                                            }}
                                            placeholder="Select Max Version">
                                            <Option value="SSLv3">SSLv3</Option>
                                            <Option value="TLSv1.0">TLSv1.0</Option>
                                            <Option value="TLSv1.1">TLSv1.1</Option>
                                            <Option value="TLSv1.2">TLSv1.2</Option>
                                            <Option value="TLSv1.3">TLSv1.3</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="minVersion"
                                        label="Min Version:"
                                        style={{
                                            marginBottom: "20px",
                                            width: "100%",
                                            maxWidth: "300px",
                                        }}
                                    >
                                        <Select
                                            style={{
                                                fontWeight: "500",
                                                textAlign: "left",
                                                fontSize: "12px",
                                                width: "100%",
                                            }}
                                            placeholder="Select Min Version">
                                            <Option value="SSLv3">SSLv3</Option>
                                            <Option value="TLSv1.0">TLSv1.0</Option>
                                            <Option value="TLSv1.1">TLSv1.1</Option>
                                            <Option value="TLSv1.2">TLSv1.2</Option>
                                            <Option value="TLSv1.3">TLSv1.3</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                        )}
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="ciphers"
                                    label="Cipher:"
                                    style={{
                                        marginBottom: "20px",
                                        width: "100%",
                                        maxWidth: "300px",
                                    }}
                                >
                                    <Input
                                        style={{
                                            fontWeight: "500",
                                            textAlign: "left",
                                            fontSize: "12px",
                                            width: "100%",
                                        }}
                                        /* <Input style={{ fontWeight: '500', display: 'inline-block', marginLeft: '12.5%', textAlign: 'left', fontSize: "12px", width: screenWidth > 1000 ? "20%" : "30%", }} */
                                        placeholder="Enter ciphers" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="IPAddress"
                                    label="IP Address/Port:"
                                    style={{
                                        marginBottom: "20px",
                                        width: "100%",
                                        maxWidth: "300px",
                                    }}

                                >
                                    <Input
                                        style={{
                                            fontWeight: "500",
                                            textAlign: "left",
                                            fontSize: "12px",
                                            width: "100%",
                                        }} placeholder="Enter IP Address/Port" />
                                </Form.Item>
                            </Col>
                        </Row>


                        <Form.Item style={{ display: 'flex', justifyContent: 'center',marginLeft: '10px' }} >
                            <Button type="primary" onClick={() => {
                                form
                                    .validateFields()
                                    .then(values => {
                                        onFinish(values);
                                    })
                                    .catch(info => {
                                        console.log('Validate Failed:', info);
                                    });
                            }}
                                style={{ alignContent: 'center' }}>
                                Save
                            </Button>
                            &nbsp;&nbsp;&nbsp;

                            <Button type="primary"
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
                    </Form >
                </div>
            </div >
        </div >

    );
};

export default GlobalContainer;
