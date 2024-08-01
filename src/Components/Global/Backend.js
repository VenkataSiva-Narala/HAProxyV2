import React, { useState, useEffect } from 'react';
import { Input, Select, Card, List, Modal, message, Spin, Tooltip, Button, Form, Row, Col, Radio, Divider } from 'antd';
import {
    PlusCircleFilled,
    MinusCircleFilled,
    PlusCircleOutlined,
    DeleteOutlined,
    MinusCircleOutlined,
    DownOutlined,
    UpOutlined,
    ExclamationCircleFilled,
    DownloadOutlined,
    EditOutlined

} from '@ant-design/icons';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import IpAddress from '../../IPConfig';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
const { Option } = Select;

const Backend = (props) => {
    const IP = IpAddress();
    const [newJsonData, setNewJsonData] = useState([{ type: "new", server: [], data: { name: '', mode: '', balance: { algorithm: "" } } }]);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [backendIndexplus, setBackendIndexPlus] = useState(1);
    const [ServerIndexplus, setServerIndexplus] = useState(1);
    const [contactPersonDeatilsIsOpen, setContactPersonDetailsIsOpen] = useState(true);
    const [form] = Form.useForm();
    const [JsonData, setJsonData] = useState({});
    const [LoadingFlag, setLoadingFlag] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [formValues, setFormValues] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const localStoragekey = localStorage.getItem('proToken')
    console.log("the token is ", localStoragekey)

    useEffect(() => {
        setLoadingFlag(true)
        fetch(IP + "backend", {
            headers: {
                "Authorization": localStoragekey
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("Jsondata", JSON.parse(data.data))
                if (data.error === 0) {
                    setJsonData(JSON.parse(data.data))
                    console.log("The data is", data);
                    setLoadingFlag(false)
                } else if (data.error === 1) {
                    message.info("Token Expired or UNAUTHORIZED")
                    navigate('/');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoadingFlag(false);
            });
    }, []);

    // console.log("Jsondata?.data?.data?.maxconn", Jsondata)



    const handleNameChange = (value, index) => {
        const updatedData = [...newJsonData];
        updatedData[index].data.name = value;
        setNewJsonData(updatedData);
    };

    const handleAlgorithmChange = (value, index) => {
        const updatedData = [...newJsonData];
        updatedData[index].data.balance.algorithm = value;
        setNewJsonData(updatedData);
    };

    const handleModeChange = (value, index) => {
        const updatedData = [...newJsonData];
        updatedData[index].data.mode = value;
        setNewJsonData(updatedData);
    };

    const removeBackend = (index) => {
        const updatedData = JsonData.filter((_, i) => i !== index);
        setNewJsonData(updatedData);
    };

    const addBackend = () => {
        const newBackend = { type: "new", server: [], data: { name: '', mode: '', balance: { algorithm: "" } } };
        setNewJsonData([...newJsonData, newBackend]);
    };

    const handlePrimaryContactChange = (index, value) => {
        const updatedData = [...newJsonData];
        updatedData[index].data.check = value;
        setNewJsonData(updatedData);
    };

    const handleClickOnPlusButton = (index) => {
        console.log("the plus button  is");
        const updatedData = [...JsonData];
        console.log("JsonData:", JsonData);
        console.log("updatedData[index]:", updatedData[index]);

        // Check if `server` exists and is an array
        if (Array.isArray(updatedData[index].server)) {
            updatedData[index].server = [];
        }
        updatedData[index].server.data.push({ name: '', address: '', port: '', check: 'disabled' });
        setJsonData(updatedData);
    };
    const handleDelete = (backendIndex, form, removeBackend) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this backend?',
            // content: 'This action cannot be undone.',
            onOk() {
                const deleteBackendData = {
                    backend: form.getFieldValue(`Backendname_${backendIndex}`)
                };
                console.log("deleteBackendData", deleteBackendData);

                axios.post(IP + '/delete_backend', deleteBackendData, {
                    headers: {
                        'Authorization': localStoragekey,
                        'Content-Type': 'application/json',
                    },
                })
                    .then(response => {
                        if (response.status === 200) {
                            if (response.data.error === 0) {
                                message.success('Backend Deleted successfully!');
                                removeBackend(backendIndex);
                                window.location.reload(true);
                            } else if (response.data.error === 1) {
                                if (response.data.msg === "You are not a sudo user!") {
                                    alert("You are not a sudo user!");
                                } else {
                                    console.error('Unexpected error value:', response.data.msg);
                                }
                            }
                        } else if (response.status === 404) {
                            console.error('Backend not found');
                        } else {
                            console.error('Unexpected response status:', response.status);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

            },
            onCancel() {
                console.log('Deletion cancelled');
            },
        });
    };


    const handleClickOnMinusOfButton = (backendIndex, serverIndex) => {
        const updatedData = [...JsonData];
        if (updatedData[backendIndex] && updatedData[backendIndex].server && updatedData[backendIndex].server.data) {

            updatedData[backendIndex].server.data = updatedData[backendIndex].server.data.filter((_, i) => i !== serverIndex);
            console.log(`Updated servers for backend ${backendIndex}:`, updatedData[backendIndex].server);

            setJsonData(updatedData);
        } else {
            console.error(`Invalid structure at backendIndex: ${backendIndex}`);
        }
    };

    const handleServerChange = (backendIndex, serverIndex, key, value) => {
        const updatedData = [...newJsonData];
        updatedData[backendIndex].server[serverIndex][key] = value;
        setNewJsonData(updatedData);
    };
    const styles = {
        container: {
            position: "relative",
            width: "100%",
            minHeight: "100vh",
            padding: "20px",
            backgroundColor: "#dee2e6",
        },
        heading: {
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
        },
        buttonRow: {
            marginBottom: "20px",
        },
        form: {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "1300px",
            backgroundColor: "#fff",
            padding: "40px",
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
        card: {
            marginTop: "0.5cm",
            backgroundColor: "#f0f2f2",
            width: "100%",
        },
        table: {
            minWidth: 650,
            size: "smaller",
        },
        tableHeader: {
            padding: "0",
            height: "0.5cm",
        },
        tableCell: {
            padding: "0",
            height: "0.5cm",
        },
        formItemSmall: {
            marginBottom: "5px",
        },
    };
    console.log("ReceivedJson", JsonData);
    const onFinish = (values) => {
        console.log('Received values:', values);


        var MainSavejsondata = []
        for (let i = 0; i < JsonData.length; i++) {
            var backendnew = {}
            backendnew.name = form.getFieldValue(`Backendname_${i}`);
            backendnew.balance = {}
            backendnew.balance.algorithm = form.getFieldValue(`Balance_${i}`);
            backendnew.mode = form.getFieldValue(`mode_${i}`);
            console.log("backendnamebackendname", backendnew);
            console.log("jsondataa===>", JsonData[i]?.server?.data?.length);
            let length = JsonData[i]?.server?.data?.length;
            if (length === 0) {
                length = 1
            }
            var servernamesforsave = [];
            for (let j = 0; j < length; j++) {
                console.log("INSAVELOOP", form.getFieldValue(`servername_${i}_${j}` ?? ''));
                var serverForMap = {}
                serverForMap.name = form.getFieldValue(`servername_${i}_${j}` ?? '');
                serverForMap.address = form.getFieldValue(`ipFQDN_${i}_${j}` ?? "");
                serverForMap.port = parseInt(form.getFieldValue(`portNumber_${i}_${j}` ?? ""));
                serverForMap.check = form.getFieldValue(`check_${i}_${j}` ?? "");
                console.log("serverForMap", serverForMap);
                servernamesforsave.push(serverForMap);
            }

            var combinedData = {
                backend_data: backendnew,
                server: servernamesforsave
            };
            MainSavejsondata.push(combinedData)


        }
        console.log("servernamesforsave", servernamesforsave);
        console.log("combinedData", MainSavejsondata)

        axios.post(IP + "save_backend", MainSavejsondata, {
            headers: {
                'Authorization': localStoragekey,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('Save response:', response);
                setLoadingFlag(false);
                if (response.status === 200) {
                    message.success('Saved successfully!');
                } else {
                    alert('Save failed: ' + response.data.msg);
                }
            })
            .catch(error => {
                console.error('Save error:', error);
                setLoadingFlag(false);
                alert('An error occurred while saving.');
            });

    };
    useEffect(() => {

        for (let i = 0; i < JsonData.length; i++) {
            console.log("it is working here");
            console.log("the length is", JsonData.length);
            const backend = JsonData[i]?.backend;
            console.log("backendbackend", backend)
            console.log("it is  here");
            console.log("it is outside here", JsonData[i]);
            form.setFieldsValue({

                [`Backendname_${i}`]: backend.name,
                [`Balance_${i}`]: backend.balance.algorithm,
                [`mode_${i}`]: backend.mode,
            })
            if (JsonData[i]?.server?.data) {

                for (let j = 0; j < JsonData[i]?.server?.data.length; j++) {
                    console.log("it is JsonData here", JsonData);
                    const server = JsonData[i]?.server?.data[j];
                    console.log("servers", server)

                    form.setFieldsValue({

                        // [`Backendname_${i}`]: backend.name,
                        // [`Balance_${i}`]: backend.balance.algorithm,
                        // [`mode_${i}`]: backend.mode,
                        [`servername_${i}_${j}`]: server.name,
                        [`ipFQDN_${i}_${j}`]: server.address,
                        [`portNumber_${i}_${j}`]: server.port,
                        [`check_${i}_${j}`]: server.check,

                    });
                }
            }
        }

    }, [JsonData]);

    console.log("Jsondata", JsonData);
    return (
        <div style={styles.container}>
            <Form layout="vertical" style={styles.form}
                form={form}
                onFinish={onFinish}
            >

                <h3 >Backend</h3>
                &nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;
                <Row justify="start" style={{ marginBottom: '20px' }}>
                    <Button
                        type="primary"
                        icon={<PlusCircleFilled />}
                        onClick={addBackend}
                    >
                        Add Backend
                    </Button>
                </Row>
                {/* {Array.from({ length: backendIndexplus }, (_, index) => ( */}
                {Array.from({ length: JsonData.length }, (_, backendIndex) => (

                    <div key={backendIndex}>
                        <Row gutter={16} style={{ marginBottom: '20px' }}>
                            <Col span={8}>
                                <Form.Item name={`Backendname_${backendIndex}`} label="Backend Name" required>
                                    <Input

                                        placeholder="Enter the backend value"
                                        // value={backend.data.name}
                                        // onChange={(e) => handleNameChange(e.target.value, backendIndex)}
                                        required
                                        style={styles.input}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label={
                                        <Tooltip title="Specify the load-balancing algorithm for distributing traffic among backend servers">
                                            Balance :
                                        </Tooltip>
                                    }
                                    name={`Balance_${backendIndex}`}
                                    required
                                >
                                    <Select
                                        placeholder="Select"

                                        // value={backend.data.balance.algorithm}
                                        onChange={(value) => handleAlgorithmChange(value, backendIndex)}
                                        required
                                        style={styles.input}
                                    >
                                        <Option value="roundrobin">roundrobin</Option>
                                        <Option value="static-rr">static-rr</Option>
                                        <Option value="leastconn">leastconn</Option>
                                        <Option value="first">first</Option>
                                        <Option value="source">source</Option>
                                        <Option value="uri">uri</Option>
                                        <Option value="url_param">url_param</Option>
                                        <Option value="hdr">hdr</Option>
                                        <Option value="random">random</Option>
                                        <Option value="rdp-cookie">rdp-cookie</Option>
                                        <Option value="hash">hash</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name={`mode_${backendIndex}`} label="Mode" required>
                                    <Select
                                        placeholder="Select"

                                        // value={backend.data.mode}
                                        onChange={(value) => handleModeChange(value, backendIndex)}
                                        required
                                        style={styles.input}
                                    >
                                        <Option value="TCP">TCP</Option>
                                        <Option value="HTTP">HTTP</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Button
                                    type="danger"
                                    // icon={<MinusCircleFilled />}
                                    icon={<DeleteOutlined style={{ color: "white" }} />}
                                    style={{ backgroundColor: "#d93737", borderColor: "red" }}
                                    onClick={() => handleDelete(backendIndex, form, removeBackend)}
                                >
                                </Button>
                            </Col>
                        </Row>
                        <Card style={styles.card}>
                            {/* style={{ marginTop: "0.5cm", backgroundColor: "#f0f2f2", width: "100%" }} */}

                            <div
                                style={{ width: "100%", cursor: "pointer" }} onClick={() => setContactPersonDetailsIsOpen(!contactPersonDeatilsIsOpen)}>
                                <a style={{ fontSize: "small", fontWeight: "500", color: "black", marginLeft: "0.2cm" }}>
                                    {contactPersonDeatilsIsOpen ? <UpOutlined onClick={() => setContactPersonDetailsIsOpen(false)} /> : <DownOutlined onClick={() => setContactPersonDetailsIsOpen(true)} />} Server Details</a>

                            </div>

                            {contactPersonDeatilsIsOpen && (
                                <div>

                                    <TableContainer>
                                        <Table sx={styles.table} aria-label="a dense table">
                                            <TableHead sx={styles.tableHeader}>
                                                <TableRow sx={styles.tableHeader}>
                                                    <TableCell sx={styles.tableCell}>
                                                        <label
                                                            name="servername"
                                                            style={{
                                                                marginLeft: "0.2cm",
                                                                fontSize: "smaller",
                                                            }}
                                                        >
                                                            Server Name
                                                        </label>
                                                    </TableCell>
                                                    <TableCell sx={styles.tableCell}>
                                                        <label name="ip/fqdn" style={{ marginLeft: "0.2cm", fontSize: "smaller" }}>
                                                            IP/FQDN
                                                        </label>
                                                    </TableCell>
                                                    <TableCell sx={styles.tableCell}>
                                                        <label name="portnumber" style={{ marginLeft: "0.2cm", fontSize: "smaller" }}>
                                                            Port Number
                                                        </label>
                                                    </TableCell>
                                                    <TableCell sx={styles.tableCell}>
                                                        <label name="check" style={{ marginLeft: "0.2cm", fontSize: "smaller" }}>
                                                            Check
                                                        </label>
                                                    </TableCell>
                                                    <TableCell sx={styles.tableCell}>
                                                        <label style={{ fontSize: "smaller" }}>Add/Delete</label>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Array.from({ length: JsonData[backendIndex].server.data.length !== 0 ? JsonData[backendIndex].server.data.length : 1 }, (_, index) => (

                                                    < TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0, marginTop: "0.5cm" }, height: "1rem" }}>
                                                        <TableCell sx={{ padding: "0", borderBottom: "none", width: "5cm" }}>
                                                            <Form.Item
                                                                name={`servername_${backendIndex}_${index}`}
                                                                style={styles.formItemSmall}
                                                            // rules={[{ required: true, message: 'Please input the Server Name' }]}
                                                            >
                                                                <Input
                                                                    placeholder="Server Name"
                                                                    style={{ width: "4cm", marginTop: "0.2cm", marginLeft: "0.1cm", }}
                                                                />
                                                            </Form.Item>
                                                        </TableCell>
                                                        <TableCell sx={{ padding: "0", borderBottom: "none", width: "5cm" }}>
                                                            <Form.Item
                                                                name={`ipFQDN_${backendIndex}_${index}`}
                                                                style={styles.formItemSmall}
                                                            // rules={[{ required: true, message: 'Please input the IP/FQDN' }]}
                                                            >
                                                                <Input
                                                                    placeholder="IP/FQDN"
                                                                    style={{ width: "4cm", marginTop: "0.2cm", marginLeft: "0.1cm", }}
                                                                />
                                                            </Form.Item>
                                                        </TableCell>
                                                        <TableCell sx={{ padding: "0", borderBottom: "none", width: "5cm" }}>
                                                            <Form.Item
                                                                name={`portNumber_${backendIndex}_${index}`}
                                                                style={styles.formItemSmall}
                                                            // rules={[{ required: true, message: 'Please input the Port Number' }]}
                                                            >
                                                                <Input
                                                                    placeholder="Port Number"
                                                                    style={{ width: "4cm", marginTop: "0.2cm", marginLeft: "0.1cm", }}
                                                                />
                                                            </Form.Item>
                                                        </TableCell>
                                                        <TableCell sx={{ padding: "0", borderBottom: "none", width: "5cm" }}>
                                                            <Form.Item
                                                                name={`check_${backendIndex}_${index}`}
                                                                style={styles.formItemSmall}
                                                            // rules={[{ required: true, message: 'Please select an option' }]}
                                                            >
                                                                <Select
                                                                    placeholder="Select"
                                                                    style={{ width: "4cm", marginTop: "0.2cm", marginLeft: "0.1cm", }}
                                                                // onChange={(value) => handlePrimaryContactChange(index, value)}
                                                                >
                                                                    <Option value="enabled">Enabled</Option>
                                                                    <Option value="disabled">Disabled</Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </TableCell>

                                                        <TableCell sx={{ padding: "0", borderBottom: "none", width: "5cm" }}>
                                                            <Form.Item style={styles.formItemSmall}>
                                                                <PlusCircleFilled onClick={() => handleClickOnPlusButton(backendIndex)} style={{ fontSize: "20px", color: "#1677ff" }} />
                                                                &nbsp;&nbsp;&nbsp;
                                                                <MinusCircleFilled style={{ fontSize: "20px", color: "rgb(255 22 22)" }}
                                                                    onClick={() => {
                                                                        const backendName = form.getFieldValue(`Backendname_${backendIndex}`);
                                                                        const serverName = form.getFieldValue(`servername_${backendIndex}_${index}`);

                                                                        if (!backendName || !serverName) {
                                                                            handleClickOnMinusOfButton(backendIndex, index);

                                                                            console.error('Backend name or server name is missing');
                                                                            return;
                                                                        }
                                                                        const deleteServerData = {

                                                                            backend: backendName,
                                                                            server: serverName
                                                                        };
                                                                        console.log("deleteServerData", deleteServerData);

                                                                        axios.post(IP + '/delete_server', deleteServerData, {

                                                                            headers: {
                                                                                'Authorization': localStoragekey,
                                                                                'Content-Type': 'application/json',
                                                                            },
                                                                        })
                                                                            .then(response => {
                                                                                if (response.status === 200) {
                                                                                    if (response.data.error === 0) {
                                                                                        message.success('Server Deleted successfully!');
                                                                                        // removeBackend(backendIndex);
                                                                                        handleClickOnMinusOfButton(backendIndex, index);
                                                                                        window.location.reload(true);
                                                                                    } else if (response.data.error === 1) {
                                                                                        if (response.data.msg === "You are not a sudo user!") {
                                                                                            alert("You are not sudo user!");
                                                                                        } else {
                                                                                            console.error('Unexpected error value:', response.data.msg);
                                                                                        }
                                                                                    }
                                                                                } else if (response.status === 404) {
                                                                                    console.error('Server not found');
                                                                                } else {
                                                                                    console.error('Unexpected response status:', response.status);
                                                                                }
                                                                            })
                                                                            .catch(error => {
                                                                                console.error('Error:', error);
                                                                            });

                                                                    }}

                                                                />
                                                            </Form.Item>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>

                            )}
                        </Card>
                        <Divider />
                    </div>

                ))}
                <Form.Item style={{ display: 'flex', justifyContent: 'center', }} >
                    <Button type="default" onClick={() => {
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



                    <Button style={{ alignContent: 'center' }} type="primary"
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
                                                    // navigate("/")
                                                    message.error("Unauthorized");
                                                }else {
                                                    console.error('Unexpected error value:', data.error);
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
                                    console.error('Error in deploy_config fetch:', error);
                                });

                        }}
                    >
                        Final Submit
                    </Button>
                </Form.Item>

            </Form >
        </div >

    );
};

export default Backend;
