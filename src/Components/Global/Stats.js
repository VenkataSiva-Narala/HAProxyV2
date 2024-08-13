import React, { useState, useEffect } from "react";
import { Button, Form, Input, Divider, message } from "antd";

// import '../CssFolder/StyleCss.css';
import IpAddress from '../../IPConfig';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Stats = (props) => {
    const IP = IpAddress();
    const IPWithoutPort = IP.replace(/^https?:\/\//, '').split(':')[0];
    const [JsonData, setJsonData] = useState({});
    const [form] = Form.useForm();
    const [enabled, setEnabled] = useState(true);
    const [uri, setUri] = useState('');
    const [bindport, setBindport] = useState('');
    const [urll, setUrll] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    //     const stats = data.data[1];
    //     if (stats.frontend.stats_options) {
    //         form.setFieldsValue({
    //             bindaddress: stats.bind[0].address,
    //             bindport: stats.bind[0].port,
    //             refreshrate: parseInt(stats.frontend.stats_options.stats_refresh_delay) / 1000,
    //             urll: stats.frontend.stats_options.stats_uri_prefix.substring(1),
    //             username: stats.frontend.stats_options.stats_auths[0].user,
    //             password: stats.frontend.stats_options.stats_auths[0].passwd,
    //         });

    //         setStatsEnabled(true);
    //     } else {
    //         setStatsEnabled(false);
    //     }
    // } else {
    //     setStatsEnabled(false);
    // }
    const localStoragekey = localStorage.getItem('proToken')
    useEffect(() => {
        if (!localStoragekey) {
            console.log('Token:', localStoragekey);
            navigate('/')
        }
    }, [])
    // console.log("the token is ", localStoragekey)
    useEffect(() => {
        fetch(IP + "stats", {
            headers: {
                "Authorization": localStoragekey
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data);
                if (data.error === 0) {
                    setJsonData(data)
                    console.log("The data is", data);
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

    useEffect(() => {
        console.log("setFieldsValue", JsonData)

        if (JsonData && JsonData.data && JsonData.data[0]) {
            const bindAddress = JsonData.data[0].bind ? JsonData.data[0].bind[0]?.address : '';
            const bindPort = JsonData.data[0].bind ? JsonData.data[0].bind[0]?.port : '';
            const refreshRate = JsonData.data[0].frontend?.stats_options ?
                parseInt(JsonData.data[0].frontend.stats_options.stats_refresh_delay) / 1000 : '';
            const url = JsonData.data[0].frontend?.stats_options?.stats_uri_prefix?.substring(1) || '';
            const username = JsonData.data[0].frontend?.stats_options?.stats_auths ?
                JsonData.data[0].frontend.stats_options.stats_auths[0]?.user : '';
            const password = JsonData.data[0].frontend?.stats_options?.stats_auths ?
                JsonData.data[0].frontend.stats_options.stats_auths[0]?.passwd : '';
            setBindport(bindPort);
            setUrll(url)
            form.setFieldsValue({
                bindaddress: bindAddress,
                bindport: bindPort,
                refreshrate: refreshRate,
                urll: url,
                username: username,
                password: password,
            });
        }

    }, [JsonData]);

    useEffect(() => {
        const anchorTag = document.getElementById("yourLinkId");
        if (anchorTag) {
            const constructedURL = `http://${IPWithoutPort}:${bindport}/${urll}`;
            console.log("Constructed URL:", constructedURL);
            anchorTag.href = constructedURL;
            anchorTag.textContent = "Go to Dashboard";
            anchorTag.target = "_blank";
        }
    }, [IPWithoutPort, bindport, urll]);

    const onFinish = (values) => {
        const data = {
            // stats_action:true,
            bindaddress: values.bindaddress,
            bindport: values.bindport,
            refreshrate: values.refreshrate,
            urll: values.urll,
            username: values.username,
            password: values.password,
        };
        if (enabled) {
            data.stats_action = true;
        } else {
            data.stats_action = false;
        }
        console.log('datadatadata:', data);
        setUri(values.uri);
        setBindport(values.bindport);
        setUrll(values.urll);
        axios.post(IP + '/save_stats', data, {
            headers: {
                'Authorization': localStoragekey,
                'Content-Type': 'application/json',
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
    const handleSelectChange = (e) => {
        setEnabled(e.target.value === 'Enable');
    };

    const styles = {
        container: {
            position: "relative",
            width: "100%",
            minHeight: "100vh",
            padding: "20px",
            backgroundColor: "#dee2e6",
        },
        header: {
            position: "relative",
            marginBottom: "20px",
            fontSize: "18px",
            fontWeight: "bold",
        },
        label: {
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
        },
        select: {
            marginLeft: "10px",
            marginRight: "10px",
        },
        link: {
            marginLeft: "10px",
            color: "#1890ff",
        },
        form: {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "1300px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        },
        row: {
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
        },
        formItem: {
            display: "flex",
            flexDirection: "column",
            width: "48%",
        },
        labelSpan: {
            fontWeight: "500",
            display: "inline-block",
            textAlign: "left",
            fontSize: "12px",
        },
        required: {
            color: "red",
        },
        input: {
            fontWeight: "500",
            textAlign: "left",
            fontSize: "12px",
            width: "100%",
            marginTop: "5px",
        },
        buttonItem: {
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
        },
        button: {
            fontWeight: "500",
            fontSize: "12px",

        },
    };
    return (
        <div style={styles.container}>
            <div style={{ display: "flex", justifyContent: "left", width: "100%" }}>
                <div style={{ width: "100%" }}>
                    <div
                        style={{
                            marginBottom: "20px",
                            border: "1px solid #d9d9d9",
                            borderRadius: "4px",
                            backgroundColor: "#fff",
                            textAlign: "left",
                            padding: "40px",
                        }}
                    >
                        <h3> Stats Action</h3>
                        <br />
                        <label style={styles.label}>
                            Stats Action
                            <select name="YESorNO" id="pref" style={styles.select}
                                onChange={handleSelectChange}>
                                <option value="Enable">Enable</option>
                                <option value="Disable">Disable</option>
                            </select>

                            <a id="yourLinkId" href="" style={styles.link}>
                                Go to Dashboard
                            </a>
                        </label>
                        {enabled && (

                            <Form form={form} layout="horizontal" style={styles.form} onFinish={onFinish}>
                                <div style={styles.row}>

                                    <Form.Item
                                        name="bindaddress"
                                        label={
                                            <span style={styles.labelSpan}>
                                                Bind Address <span style={styles.required}>*</span>
                                            </span>
                                        }
                                        style={styles.formItem}
                                    >
                                        <Input
                                            style={styles.input}
                                            placeholder="Enter Bind Address"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="bindport"
                                        label={
                                            <span style={styles.labelSpan}>
                                                Bind Port <span style={styles.required}>*</span>
                                            </span>
                                        }
                                        style={styles.formItem}
                                    >
                                        <Input placeholder="Enter Bind Port" style={styles.input} />

                                    </Form.Item>
                                </div>
                                <div style={styles.row}>
                                    <Form.Item
                                        name="refreshrate"
                                        label={
                                            <span style={styles.labelSpan}>
                                                Refresh Rate <span style={styles.required}>*</span>
                                            </span>
                                        }
                                        style={styles.formItem}
                                    >
                                        <Input
                                            placeholder="Enter Refresh Rate"
                                            style={styles.input}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="urll"
                                        label={
                                            <span style={styles.labelSpan}>
                                                URL <span style={styles.required}>*</span>
                                            </span>
                                        }
                                        style={styles.formItem}
                                    >
                                        <Input placeholder="Enter URL" style={styles.input} />
                                    </Form.Item>
                                </div>
                                <div style={styles.row}>
                                    <Form.Item
                                        name="username"
                                        label={
                                            <span style={styles.labelSpan}>
                                                Username <span style={styles.required}>*</span>
                                            </span>
                                        }
                                        style={styles.formItem}
                                    >
                                        <Input placeholder="Enter Username" style={styles.input} />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        label={
                                            <span style={styles.labelSpan}>
                                                Password <span style={styles.required}>*</span>
                                            </span>
                                        }
                                        style={styles.formItem}
                                    >
                                        <Input
                                            placeholder="Enter Password"
                                            type="password"
                                            style={styles.input}
                                        />
                                    </Form.Item>
                                </div>
                            </Form>
                        )}
                        <div>
                            <Form.Item style={styles.buttonItem}>
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
                                    style={{ alignContent: 'center', marginLeft: '10px' }}>
                                    Save
                                </Button>
                                &nbsp;&nbsp;&nbsp;
                                <Button type="primary" style={{ marginTop: "20px" }}
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
                        </div>


                        <Divider />
                        {/* <div style={{ display: 'flex', justifyContent: 'center', }}>
                          
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Stats;

