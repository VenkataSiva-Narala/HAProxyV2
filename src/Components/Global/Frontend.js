import React, { useState, useEffect, useRef } from 'react';
import { Select, Input, Form, Checkbox, Divider, message, Row, Col, Tooltip, Button } from 'antd';
import { PlusCircleFilled, MinusCircleFilled, DeleteOutlined,  } from '@ant-design/icons';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import IpAddress from '../../IPConfig';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

const { Option } = Select;

const FrontendConfig = (props) => {
    const IP = IpAddress();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [compression, setCompression] = useState([]);

    // const [compressionTypes, setCompressionTypes] = useState(new Set());
    const [form] = Form.useForm();
    const [Jsondata, setJsonData] = useState({});
  
    const navigate = useNavigate();
    const [checkedValues, setCheckedValues] = useState([]);
    const containerRef = useRef(null);

    const [frontendConfigurations, setFrontendConfigurations] = useState([

        {
            frontendName: '',
            defaultBackend: 'Select',
            compression: '',
            compressionAlgo: '',
            mode: '',
            httpRedirect: '',
            compressionTypes: new Set(),
            binds: [{ address: '', name: '', port: '', ssl_certificate: '', ssl: false }] // Default bind field
        }
    ]);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const handleClickOnPlusButton = (frontendIndex) => {
        // setAddFrontendPlusButton(Addfrontendplusbutton + 1)

        const newBindData = [...Jsondata.frontend_data[frontendIndex].bind.data, {}];
        console.log("newBindData", newBindData);
        setJsonData({
            ...Jsondata,
            frontend_data: Jsondata.frontend_data.map((frontend, idx) =>
                idx === frontendIndex ? { ...frontend, bind: { ...frontend.bind, data: newBindData } } : frontend
            )
        });
    };

    useEffect(() => {
        if (containerRef.current) {
            const children = containerRef.current.children;
            if (children.length > 0) {
                const lastChild = children[children.length - 1];
                lastChild.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [Jsondata]);

  
    // useEffect(() => {
    // 	if (!localStorage.getItem("proToken")) {
    // 		navigate('/')
    // 	}
    // }, [])

    const handleCheckboxChange = (type) => {
        console.log("Changetype", type);
        setCheckedValues(type);
        console.log("handleCheckboxChange", checkedValues);
    };
    useEffect(() => {
        console.log("Updated checkedValues:", checkedValues);
    }, [checkedValues]);

    const handleClickOnMinusOfButton = (frontendIndex, Index) => {
        // setAddFrontendPlusButton(Addfrontendplusbutton - 1)
        const newBindData = Jsondata.frontend_data[frontendIndex].bind.data.filter((_, idx) => idx !== Index);
        setJsonData({
            ...Jsondata,
            frontend_data: Jsondata.frontend_data.map((frontend, idx) =>
                idx === frontendIndex ? { ...frontend, bind: { ...frontend.bind, data: newBindData } } : frontend
            )
        });

    };
    const handleAddFrontend = () => {
        console.log("josondata.frontend", Jsondata);
        const newFrontend = {
            bind: {
                data: [
                    { address: '', name: '', port: '', SSLCert: '' }
                ]
            },
            frontend: {
                name: '',
                mode: '',
                compression: { algorithms: [""], types: [""] },
            },
            httpredirect: false,
        };
        const tempdata = {
            ...Jsondata,
            frontend_data: [...Jsondata.frontend_data, newFrontend]
        };

        console.log("tempdata===>", tempdata);

        // Update the state immutably
        setJsonData(tempdata);

    };
    console.log("Afteradding", Jsondata);

    const handleDeleteFrontend = (index) => {
        var tempData = [...Jsondata.frontend_data];

        tempData.splice(index, 1);
        setJsonData(prevState => ({
            ...prevState,
            frontend_data: tempData
        }));
        console.log("handleDeleteFrontend", tempData);

    };


    const localStoragekey = localStorage.getItem('proToken')
    useEffect(() => {
        if (!localStoragekey) {
            console.log('Token:', localStoragekey);
            navigate('/')
        }
    }, [])
    useEffect(() => {
        fetch(IP + "frontend", {
            headers: {
                "Authorization": localStoragekey
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("JsondataJsondataJsondataJsondata", data?.frontend_data);
                if (data.error === 0) {
                    setJsonData(data)
                    var allcompressionvalues = []
                    for (let i = 0; i < data.frontend_data.length; i++) {
                        // console.log("datalength", data.frontend_data.length)
                        // console.log("data?.frontend_data[i]?.frontend?.compression",data?.frontend_data[i]?.frontend?.compression)
                        var allcompression = data?.frontend_data[i]?.frontend?.compression
                        if (allcompression) {
                            allcompressionvalues.push('Yes')
                        } else {
                            allcompressionvalues.push('No')
                        }
                        console.log("allcompressionvalues", allcompression);
                        // console.log("setCompression",compression);

                    }
                    setCompression(allcompressionvalues);


                    console.log("The data is", data);
                } else if (data.error === 1) {
                    message.info("Token Expired or Unauthorized")
                    navigate('/');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    console.log("Jsondata?.data?.data?.maxconn", Jsondata?.frontend_data?.frontend?.compression);
    console.log("setCompression>", compression);





  
    const handleCompressionChange = (value, index) => {
        const newJsonData = { ...compression };
        newJsonData[index] = value;
        console.log("newJsonData", newJsonData);
        // newJsonData.frontend_data[index].frontend.compression = value;
        setCompression(newJsonData);
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
    console.log("beforecheckedvalues", checkedValues);
    useEffect(() => {
        if (Jsondata?.frontend_data) {
            const defaultDataValues = []

            for (let i = 0; i < Jsondata.frontend_data.length; i++) {
                const frontendData = Jsondata.frontend_data[i];
                
                const compressiontypeValue = frontendData?.frontend?.compression?.types 
                defaultDataValues.push(compressiontypeValue)

                console.log("the length is", Jsondata.frontend_data.length);
                // const frontendbackendNames = Jsondata.backend_names;
                // console.log("frontendbackendNames", defaultDataValues);

                if (frontendData?.frontend) {
                    console.log("Frontend Name:", frontendData?.frontend?.name);
                    console.log("Frontend Mode:", frontendData?.frontend?.mode);
                    // console.log("HTTP Redirect:", frontendData?.http_redirect);
                    console.log("compression:compression:", Jsondata?.frontend_data[0]?.frontend?.compression?.algorithms[0]);
                    console.log("compression:type", Jsondata?.frontend_data[0]?.frontend?.compression?.types);

                    console.log("HTTP Redirect:", frontendData?.frontend?.compression?.types);

                    const compressAlgo=frontendData?.frontend?.compression?.algorithms[0] ??'';
                    const compressionType=frontendData?.frontend?.compression?.types ??'';

                    form.setFieldsValue({
                        compressAlgo: compressAlgo,
                        compressionType: compressionType
                    });
                    if(compressAlgo &&compressionType ){
                        form.setFieldsValue({ compression: "Yes" });
                    }
                    else{
                        form.setFieldsValue({ compression: "" });

                    }

                    form.setFieldsValue({
                        [`frontendname_${i}`]: frontendData?.frontend?.name,
                        [`mode_${i}`]: frontendData?.frontend?.mode,
                        [`httpredirect_${i}`]: frontendData?.http_redirect,
                        [`DefaultBackend_${i}`]: frontendData?.frontend?.default_backend,
                        [`compression_${i}`]:"Yes",
                        [`compressionAlgo_${i}`]: frontendData?.frontend?.compression?.algorithms[0],

                        // frontendData.frontend.compression.types=checkedValues
                        [`compressionType_${i}`]: frontendData?.frontend?.compression?.types,
                    })
                    if (frontendData?.bind?.data) {
                        for (let j = 0; j < frontendData.bind.data.length; j++) {
                            const bind = frontendData.bind.data[j];
                            console.log("serversserversservers", bind);

                            form.setFieldsValue({
                                [`bindAddress_${i}_${j}`]: bind?.address,
                                [`bindname_${i}_${j}`]: bind?.name,
                                [`portnumber_${i}_${j}`]: bind?.port,
                                [`SSLCert_${i}_${j}`]: '/home/ipmcloud/ssl_folder/new2/mydomain.pem',

                            });

                        }
                    }
                }
            }
            console.log("Default Data Values:", defaultDataValues);
            // setCheckedValues(defaultDataValues);
        }
    }, [Jsondata]);

    console.log("the data is this", Jsondata);


    const onFinish = (values) => {
        console.log('Received values:', values);
        var MainSavejsondata = []

        for (let i = 0; i < Jsondata.frontend_data.length; i++) {
            var frontendvalues = {}
           
            console.log("updatedValues", checkedValues);
            //  var frontendData = Jsondata.frontend_data[i];
            //  console.log("frontendDatafrontendData",frontendData);
            frontendvalues.name = form.getFieldValue(`frontendname_${i}`);
            frontendvalues.mode = form.getFieldValue(`mode_${i}`);
            // frontendvalues.http_redirect = form.getFieldValue(`httpredirect_${i}`);
            frontendvalues.default_backend = form.getFieldValue(`DefaultBackend_${i}`);
            frontendvalues.algorithms = [];
            frontendvalues.algorithms[0] = form.getFieldValue(`compressionAlgo_${i}`);
            frontendvalues.types = checkedValues;

            console.log("backendnamebackendname", frontendvalues);
            var bindnamesforsave = [];
            for (let j = 0; j < Jsondata.frontend_data[i].bind.data.length; j++) {
                var binddataForMap = {}

                binddataForMap.address = form.getFieldValue(`bindAddress_${i}_${j}`);
                binddataForMap.name = form.getFieldValue(`bindname_${i}_${j}`);
                binddataForMap.port = parseInt(form.getFieldValue(`portnumber_${i}_${j}`) || 0);
                binddataForMap.ssl_certificate = form.getFieldValue(`SSLCert_${i}_${j}`);

                // binddataForMap.check = form.getFieldValue(`check_${i}_${j}`);
                console.log("serverForMap", binddataForMap);
                bindnamesforsave.push(binddataForMap);
            }
            console.log("servernamesforsave", bindnamesforsave);

            var combinedData = {
                frontend_data: frontendvalues,
                bind: bindnamesforsave,
                http_redirect: form.getFieldValue(`httpredirect_${i}`)

            };
            MainSavejsondata.push(combinedData)
            console.log("combinedData", MainSavejsondata)
        }


        axios.post(IP + "save_frontend", MainSavejsondata, {
            headers: {
                'Authorization': localStoragekey,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('Save response:', response);
                if (response.status === 200) {
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
    var checkboxOptions = ['text/css', 'text/html', 'text/javascript', 'application/javascript', 'text/plain', 'text/xml', 'application/json']
    console.log("Jsondata?.frontend_data?.length", Jsondata);
    console.log("the valueis ", Jsondata.frontend_data)

    return (
        <div style={styles.container}>
            <Form layout="vertical" style={styles.form}
                form={form}
                onFinish={onFinish}
            >
                <h3 >Frontend</h3>
                &nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;
                <Row justify="start" style={{ marginBottom: '20px' }}>
                    <Button
                        type="primary"
                        // style={{ alignContent: 'center',  }}
                        icon={<PlusCircleFilled />}
                        onClick={handleAddFrontend}
                    >
                        Add Frontend
                    </Button>
                </Row>
                &nbsp;&nbsp;&nbsp;
                <div ref={containerRef}>
                    {Array.from({ length: Jsondata?.frontend_data?.length }, (_, bindIndex) => (
                        // const frontendData = Jsondata.frontend_data[bindIndex];
                        <div key={bindIndex} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #d9d9d9", borderRadius: "4px", backgroundColor: "#fff" }}>
                            <Button type="danger" style={{ float: "right", backgroundColor: "#d93737", borderColor: "red" }}
                                icon={<DeleteOutlined style={{ color: "white" }} />}
                                onClick={() => handleDeleteFrontend(bindIndex)}
                            >

                            </Button>
                            <Row gutter={16} style={{ marginBottom: '20px' }}>
                                <Col span={8}>
                                    <Form.Item name={`frontendname_${bindIndex}`}
                                        label="Frontend Name" required>
                                        <Input
                                            // disabled={frontendData?.frontend?.name === 'stats'}
                                            placeholder="Enter the Frontend value"
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
                                                Default Backend :
                                            </Tooltip>
                                        }

                                        name={`DefaultBackend_${bindIndex}`}
                                        required
                                    >
                                        <Select
                                            value={Jsondata?.backend_names}
                                            // onChange={(value) => handleFrontendChange(bindIndex, "defaultBackend", value)}
                                            style={{ width: "100%" }}
                                            placeholder="Select option"
                                        >
                                            {/* <Option value="Select">Select</Option> */}
                                            {Jsondata?.backend_names &&
                                                Jsondata?.backend_names.map((optionData, idx) => (
                                                    <Option key={idx} value={optionData}>
                                                        {optionData}
                                                    </Option>
                                                ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name={`mode_${bindIndex}`} label="Mode">
                                        <Select
                                            value={Jsondata.frontend_data.mode}
                                            // onChange={(value) => {
                                            //     const updatedFrontends = [...frontendConfigurations];
                                            //     updatedFrontends[bindIndex].mode = value;
                                            //     setFrontendConfigurations(updatedFrontends);
                                            // }}
                                            style={{ width: '100%' }}
                                        >
                                            <Option value="HTTP">HTTP</Option>
                                            <Option value="TCP">TCP</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item name={`httpredirect_${bindIndex}`} label="HTTP Redirect">
                                        <Select
                                            // value={Jsondata?.frontend_data?.http_redirect}
                                            // onChange={(value) => {
                                            //     const updatedFrontends = [...frontendConfigurations];
                                            //     updatedFrontends[bindIndex].httpRedirect = value;
                                            //     setFrontendConfigurations(updatedFrontends);
                                            // }}
                                            style={{ width: '100%' }}
                                        >
                                            <Option value="">Select Option</Option>
                                            <Option value={true}>True</Option>
                                            <Option value={false}>False</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name={`compression_${bindIndex}`} label="Compression">
                                        <Select
                                            // defaultValue={"Yes"}
                                            // value={Jsondata?.frontend_data[bindIndex]?.frontend?.compression}
                                            placeholder="Select Option"
                                            onChange={(value) => handleCompressionChange(value, bindIndex)}
                                        >
                                            <Option value="Yes">Yes</Option>
                                            <Option value="No">No</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>


                                {compression[bindIndex] === 'Yes' && (
                                    <>
                                        <Divider />
                                        {/* <Row gutter={8}> */}
                                        <Col span={8}>
                                            <Form.Item name={`compressionAlgo_${bindIndex}`} label="Compression Algo">
                                                <Select
                                                    defaultValue={Jsondata?.frontend_data[bindIndex]?.frontend?.compression?.algorithms[0] || ''}
                                                // onChange={(value) => handleCompressionAlgoChange(value, bindIndex)}
                                                >
                                                    <Option value="gzip">gzip</Option>
                                                    <Option value="deflate">deflate</Option>
                                                    <Option value="raw-deflate">raw-deflate</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        {/* </Row> */}
                                        <Col span={8}>
                                            <Form.Item name={`compressionType_${bindIndex}`}
                                                label="Compression Type"
                                            >
                                                <Checkbox.Group options={checkboxOptions} onChange={handleCheckboxChange}
                                                    // defaultValue={checkedValues[bindIndex]}
                                                />
                                                {/* {['text/css', 'text/html', 'text/javascript', 'application/javascript', 'text/plain', 'text/xml', 'application/json'].map((type) => (
                                                    <Checkbox
                                                        defaultValue={Jsondata?.frontend_data[bindIndex]?.frontend?.compression?.types || false}
                                                        key={type}
                                                        checked={checkedValues.includes(type)}
                                                        // checked={checkedValues.some(checkedCheckbox => checkedCheckbox.value === type.value)}
                                                        onChange={() => handleCheckboxChange(type)}

                                                        style={{ marginRight: '8px' }}
                                                    >
                                                        {type}
                                                    </Checkbox>
                                                ))} */}

                                            </Form.Item>
                                        </Col>

                                    </>
                                )}

                            </Row>
                            <div>
                                <label>Binds:</label>
                                <div style={{
                                    width: screenWidth < 700 ? "10cm" : screenWidth > 700
                                }}
                                >
                                    <TableContainer>
                                        <Table sx={{ minWidth: 650 }} aria-label="a dense table">
                                            <TableHead sx={styles.tableHeader}>
                                                <TableRow sx={styles.tableHeader}>
                                                    <TableCell sx={styles.tableCell}>
                                                        <label
                                                            name="bindAddress:"
                                                            style={{
                                                                marginLeft: "0.2cm",
                                                                fontSize: "smaller",
                                                            }}
                                                        >
                                                            Bind Address:
                                                        </label>
                                                    </TableCell>
                                                    <TableCell sx={styles.tableCell}>
                                                        <label name="bindname" style={{ marginLeft: "0.2cm", fontSize: "smaller" }}>
                                                            Bind Name
                                                        </label>
                                                    </TableCell>
                                                    <TableCell sx={styles.tableCell}>
                                                        <label name="portnumber" style={{ marginLeft: "0.2cm", fontSize: "smaller" }}>
                                                            Bind Port
                                                        </label>
                                                    </TableCell>
                                                    <TableCell sx={styles.tableCell}>
                                                        <label name="check" style={{ marginLeft: "0.2cm", fontSize: "smaller" }}>
                                                            SSL Certificate
                                                        </label>
                                                    </TableCell>
                                                    <TableCell sx={styles.tableCell}>
                                                        <label style={{ fontSize: "smaller" }}>Add/Delete</label>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Array.from({ length: Jsondata?.frontend_data[bindIndex]?.bind?.data.length !== 0 ? Jsondata?.frontend_data[bindIndex]?.bind?.data.length : 1 }, (_, Index) => (

                                                    < TableRow key={Index} sx={{ '&:last-child td, &:last-child th': { border: 0, marginTop: "0.5cm" }, height: "1rem" }}>
                                                        <TableCell sx={{ padding: "0", borderBottom: "none", width: "5cm" }}>
                                                            <Form.Item
                                                                name={`bindAddress_${bindIndex}_${Index}`}
                                                                style={styles.formItemSmall}
                                                            // rules={[{ required: true, message: 'Please input the Bind Address' }]}
                                                            >
                                                                <Input
                                                                    placeholder="Bind Address"
                                                                    style={{ width: "4cm", marginTop: "0.2cm", marginLeft: "0.1cm", }}
                                                                />
                                                            </Form.Item>
                                                        </TableCell>
                                                        <TableCell sx={{ padding: "0", borderBottom: "none", width: "5cm" }}>
                                                            <Form.Item
                                                                name={`bindname_${bindIndex}_${Index}`}
                                                                style={styles.formItemSmall}
                                                            // rules={[{ required: true, message: 'Please input the bind name' }]}
                                                            >
                                                                <Input
                                                                    placeholder="Bind Name"
                                                                    style={{ width: "4cm", marginTop: "0.2cm", marginLeft: "0.1cm", }}
                                                                />
                                                            </Form.Item>
                                                        </TableCell>
                                                        <TableCell sx={{ padding: "0", borderBottom: "none", width: "5cm" }}>
                                                            <Form.Item
                                                                name={`portnumber_${bindIndex}_${Index}`}
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

                                                                name={`SSLCert_${bindIndex}_${Index}`}
                                                                style={styles.formItemSmall}
                                                            // rules={[{ required: true, message: 'Please select an SSL Certificate' }]}
                                                            >
                                                                <Input
                                                                    placeholder="SSL Certificate"

                                                                    style={{ width: "4cm", marginTop: "0.2cm", marginLeft: "0.1cm", }}
                                                                />

                                                            </Form.Item>
                                                        </TableCell>

                                                        <TableCell sx={{ padding: "0", borderBottom: "none", width: "5cm" }}>
                                                            <Form.Item style={{ width: "5cm", marginBottom: "5px" }}>
                                                                &nbsp;&nbsp;
                                                                <PlusCircleFilled
                                                                    onClick={() => handleClickOnPlusButton(bindIndex)} style={{ fontSize: "20px", color: "#1677ff" }} />
                                                                &nbsp;&nbsp;&nbsp;
                                                                <MinusCircleFilled style={{ fontSize: "20px", color: "rgb(255 22 22)" }}
                                                                    onClick={() => {
                                                                        const frontendName = form.getFieldValue(`frontendname_${bindIndex}`);
                                                                        const binddetails = form.getFieldValue(`bindname_${bindIndex}_${Index}`);
                                                                        if (!frontendName || !binddetails) {
                                                                            handleClickOnMinusOfButton(bindIndex, Index);

                                                                            console.error('Backend name or server name is missing');
                                                                            return;
                                                                        }
                                                                        const deleteBindData = {
                                                                            frontend: frontendName,
                                                                            bind: binddetails
                                                                        };
                                                                        console.log("deleteServerData", deleteBindData);
                                                                        axios.post(IP + '/delete_bind', deleteBindData, {

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
                                                                                        window.location.reload(true);
                                                                                    } else if (response.data.error === 1) {
                                                                                        if (response.data.msg === "You are not a sudo user!") {
                                                                                            message.info("You are not sudo user!");
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
                            </div>


                            <Divider />

                        </div>

                    ))}
                </div>
                <Form.Item style={{ display: 'flex', justifyContent: 'center', }} >
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

                {/* <Button type="primary" style={{ alignContent: 'center' }} onClick={handleAddFrontend}>
                    Add Frontend
                </Button> */}

            </Form >
        </div >

    );
};

export default FrontendConfig;