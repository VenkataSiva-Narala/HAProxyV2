
import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Row, Col, message } from "antd";
import { PlusCircleFilled, MinusCircleFilled, } from "@ant-design/icons";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import IpAddress from "../../IPConfig";

const AclComponent = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [JsonData, setJsonData] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const IP = IpAddress();
  const [frontendOptions, setFrontendOptions] = useState([]);
  const [selectedfrontend, setSelectedFrontend] = useState(null);
  const [aclData, setAclData] = useState(null);

  const { Option } = Select;

  const localStoragekey = localStorage.getItem("proToken");
  console.log("localStoragekeylocalStoragekey", localStoragekey);
  useEffect(() => {
    if (!localStoragekey) {
      console.log('Token:', localStoragekey);
      navigate('/')
    }
  }, [])
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  useEffect(() => {
    fetch(IP + "acl_lines", {
      headers: {
        Authorization: localStoragekey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFrontendOptions([]);
        setAclData([]);
        const frontendSet = new Set();

        data.data.forEach((val) => {
          if (!frontendSet.has(val.frontend)) {
            console.log("val.frontend", val.frontend);
            if (!selectedfrontend) {
              setSelectedFrontend(val.frontend)
            }

            setFrontendOptions((prev) => [
              ...prev,
              { value: val.frontend, label: val.frontend },
            ]);
            frontendSet.add(val.frontend);
          }

          console.log("setSelectedFrontend", selectedfrontend);
          console.log("frontendSet", frontendSet)
        });
        console.log("data===>", data.data);
        setAclData(data.data);
       
        console.log("setJsonData", data);
        setJsonData(data.data);
        

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
       
      });
  }, []);
  console.log("jsonfrombackend", JsonData);

  // console.log("Seleted", JsonData);
  useEffect(() => {
    if (JsonData) {
      for (let i = 0; i < JsonData.length; i++) {
        if (JsonData[i].frontend === selectedfrontend) {
          console.log("JsonDataJsonData", JsonData[i]?.acl.data);
          if (JsonData[i]?.acl.data.length !== 0) {
            setAclData(JsonData[i]?.acl.data);

          }
          else {
            var dummy = [{ acl_name: "", criterion: "", index: 0, value: "" }]
            setAclData(dummy)
          }
          break;
        }
      }
    }
  }, [JsonData, selectedfrontend])

  useEffect(() => {

    // if (aclData?.length === 0) {
    //     form.resetFields(["condition_0", "aclName_0", "backendname_0"]);
    // }
    var dummyrulesacl = [];
    for (let i = 0; i < aclData?.length; i++) {
      console.log("InForloop", i, aclData[i]);

      form.setFieldsValue({
        [`aclname_${i}`]: aclData[i]?.acl_name,
        [`criterion_${i}`]: aclData[i]?.criterion,
        [`index_${i}`]: i,
        [`value_${i}`]: aclData[i]?.value,
      })
    }
  }, [aclData]);


  const onFinish = (values) => {
    console.log('Received values:', values);
    var MainSavejsondata = []
    for (let i = 0; i < aclData?.length; i++) {
      console.log("in save loop", aclData);

      var aclvalues = {
        frontend: selectedfrontend,
        data: {
          acl_name: form.getFieldValue(`aclname_${i}`),
          criterion: form.getFieldValue(`criterion_${i}`),
          value: form.getFieldValue(`value_${i}`),
          index: form.getFieldValue(`index_${i}`),
        }

      };
      console.log("backendnamebackendname", aclvalues);
      MainSavejsondata.push(aclvalues);
      console.log('MainSavejsondata:', MainSavejsondata);

    }
    axios.post(IP + "save_acl_rule", MainSavejsondata, {
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


  const handleClickOnPlusButton = (aclIndex) => {
    const updatedData = [...aclData, { acl_name: null, criterion: null, index: aclIndex + 1, value: null }];
    setAclData(updatedData)
  };
  const handleDelete = (index) => {
    console.log("aclData", aclData);
    var tempData = [...aclData];
    console.log("tempData", tempData)
    tempData.splice(index, 1)

    setAclData(tempData);

  };
  // const handleClickOnMinusOfButton = (backendIndex) => {
  //   const updatedData = [...JsonData];
  //   updatedData[backendIndex].acl.data = updatedData[backendIndex].acl.data.filter((_, i) => i );
  //   setResultAcl(updatedData);
  // };


  const styles = {
    container: {
      // display: "flex",
      // flexDirection: "column",
      position: "relative",
      padding: "20px",
      backgroundColor: "#f0f2f5",
      borderRadius: "5px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      margin: "20px",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    buttonRow: {
      // display: "flex",
      // justifyContent: "flex-end",
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
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
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

      // marginBottom: "5px",
    },
  };
  const mobileStyles = {
    formItem: {
      width: "100%",
      marginBottom: "10px",
    },
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#dee2e6",
      }}
    >

      <Form
        layout="vertical"
        form={form}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "1300px",
          backgroundColor: "#fff",
          padding: "40px",
        }}
      >
        <div
          style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}
        >
          ACL
        </div>
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          <Col span={8}>
            <Form.Item label="Frontend Name" required>
              <Select
                // onChange={(value) => {
                //   handleFrontEndSelect(value);
                // }}
                style={{ width: "100%" }}
                placeholder="Select frontend"
                options={frontendOptions}
                value={selectedfrontend}
                onChange={(value) => setSelectedFrontend(value)}
                defaultValue={selectedfrontend}

              />
            </Form.Item>
          </Col>
        </Row>
        <div style={{
          width: screenWidth < 700 ? "10cm" : screenWidth > 700                     
        }}
        >
          <TableContainer>
            <Table sx={styles.table} aria-label="a dense table">
              <TableHead sx={styles.tableHeader}>
                <TableRow sx={styles.tableHeader}>
                  <TableCell sx={styles.tableCell}>
                    <label name="Acl Name:"
                      style={{
                        marginLeft: "0.2cm",
                        fontSize: "smaller",
                      }}
                    >ACL Name
                    </label>
                  </TableCell>
                  <TableCell sx={styles.tableCell}>
                    <label name="Criterion:"
                      style={{
                        marginLeft: "0.2cm",
                        fontSize: "smaller",
                      }}
                    >Criterion
                    </label>
                  </TableCell>
                  <TableCell sx={styles.tableCell}>
                    <label name="Index:"
                      style={{
                        marginLeft: "0.2cm",
                        fontSize: "smaller",
                      }}
                    >Index
                    </label>
                  </TableCell>
                  <TableCell sx={styles.tableCell}>
                    <label name="Value:"
                      style={{
                        marginLeft: "0.2cm",
                        fontSize: "smaller",
                      }}
                    >Value
                    </label>
                  </TableCell>
                  <TableCell sx={styles.tableCell}>
                    <label style={{ marginLeft:"5%",fontSize: "smaller" }}
                    >Add/Delete</label>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                {Array.from({ length: aclData?.length !== 0 ? aclData?.length : 1 }, (_, index) => (

                  < TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0, marginTop: "0.5cm" }, height: "1rem" }}>
                    <TableCell sx={{ padding: "0", borderBottom: "none", width: "5cm" }}>
                      <Form.Item
                        name={`aclname_${index}`}
                        style={screenWidth < 768 ? mobileStyles.formItem : styles.formItemSmall}
                      // rules={[{ required: true, message: 'Please select an option' }]}
                      >
                        <Input
                          placeholder="ACL Name"
                          type='text'
                          style={{ width: "4cm", marginTop: "0.2cm", marginLeft: "0.1cm", }}
                        />
                      </Form.Item>
                    </TableCell>
                    <TableCell sx={{ padding: "0", borderBottom: "none", width: "5cm" }}>
                      <Form.Item
                        name={`criterion_${index}`}
                        style={screenWidth < 768 ? mobileStyles.formItem : styles.formItemSmall}
                      // rules={[{ required: true, message: 'Please select an option' }]}
                      >
                        <Select
                          placeholder="Select"
                          style={{ width: "4cm", marginTop: "0.2cm", marginLeft: "0.1cm", }}
                          // value={acl.criterion}
                          // onChange={(value) => handleInputChange(acl.index, 'criterion', value)}
                          required
                        >
                          <Option value="src">Source</Option>
                          <Option value="dst_port">Destination-port</Option>
                          <Option value="hdr(host)">Host</Option>
                          <Option value="req_ssl_ver">SSL Version</Option>
                          <Option value="path_beg">Path begin with</Option>
                          <Option value="path_end">Path ends with</Option>
                          <Option value="hdr_beg(host)">Host begin with</Option>
                          <Option value="hdr_end(host)">Host ends with</Option>
                          <Option value="method">Method</Option>
                          <Option value="status">Status</Option>
                        </Select>

                      </Form.Item>
                    </TableCell>
                    <TableCell sx={{ padding: "0", borderBottom: "none", width: "5cm" }}>
                      <Form.Item
                        name={`index_${index}`}
                        style={screenWidth < 768 ? mobileStyles.formItem : styles.formItemSmall}
                      >
                        <Input
                          type="number"
                          disabled
                          // value={record.index}
                          // onChange={(e) => handleSelectChange(e.target.value, "index")}
                          style={{ width: "4cm", marginTop: "0.2cm", marginLeft: "0.1cm", }}
                        />
                      </Form.Item>
                    </TableCell>
                    <TableCell sx={{ padding: "0", borderBottom: "none", width: "5cm" }}>
                      <Form.Item
                        name={`value_${index}`}
                        style={screenWidth < 768 ? mobileStyles.formItem : styles.formItemSmall}
                      // rules={[{ required: true, message: 'Please select an option' }]}
                      >
                        <Input
                          placeholder="Value"
                          type='text'
                          style={{ width: "4cm", marginTop: "0.2cm", marginLeft: "0.1cm", }}
                        />
                      </Form.Item>
                    </TableCell>
                    <TableCell sx={{ padding: "0", borderBottom: "none", width: "5cm" }}>
                      <Form.Item style={{width:"5cm",marginBottom: "5px"}}>
                        &nbsp;&nbsp;
                        <PlusCircleFilled onClick={() => handleClickOnPlusButton(index)} style={{ fontSize: "20px", color: "#1677ff" }} />
                        &nbsp;&nbsp;&nbsp;
                        <MinusCircleFilled style={{ fontSize: "20px", color: "rgb(255 22 22)", cursor: "pointer" }}
                          // onClick={() => handleDelete(index)} 
                          onClick={() => {
                           
                         

                            const ACLNames = form.getFieldValue(`aclname_${index}`)?.trim() !== "" ? form.getFieldValue(`aclname_${index}`) : null;
                            const Criterion = form.getFieldValue(`criterion_${index}`)?.trim() !== "" ? form.getFieldValue(`criterion_${index}`) : null;
                            const Value = form.getFieldValue(`value_${index}`)?.trim() !== "" ? form.getFieldValue(`value_${index}`) : null;
                            handleDelete(index);
                            if (Criterion && ACLNames && Value) {


                              console.error('frontend name or index is missing');


                              const deleteBindData = {

                                frontend: selectedfrontend,
                                index: form.getFieldValue(`index_${index}`),
                              };
                              console.log("deleteServerData", deleteBindData);
                              axios.post(IP + '/delete_acl_rule', deleteBindData, {

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
                            }
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
        &nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;
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
                    message.error("Unauthorized");
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
  );
};

export default AclComponent;

