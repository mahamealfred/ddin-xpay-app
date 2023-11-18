import React, { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip } from "recharts";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [totalCounter, setTotalCounter] = useState(0);
  const [successCounter, setSuccessCounter] = useState(0);
  const [failureCounter, setFailureCounter] = useState(0);
  const [todayDate, setTodayDate] = useState(getTodayDate());
  let eventSource;

  function getTodayDate() {
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return today.toLocaleDateString(undefined, options);
  }

  useEffect(() => {
    const createEventSource = () => {
      eventSource = new EventSource("http://localhost:8080/api/v1/messages");

      eventSource.onmessage = (event) => {
        setMessages((prevMessages) => [...prevMessages, event.data]);
        setTotalCounter((prevCount) => prevCount + 1);

        if (event.data.toLowerCase().includes("success")) {
          setSuccessCounter((prevSuccessCount) => prevSuccessCount + 1);
        } else if (event.data.toLowerCase().includes("failure")) {
          setFailureCounter((prevFailureCount) => prevFailureCount + 1);
        }
      };

      eventSource.onerror = (error) => {
        console.error("Error with SSE connection:", error);

        // Log additional details about the error
        console.log("EventSource.readyState:", eventSource.readyState);
        console.log("EventSource.url:", eventSource.url);
        console.log(
          "EventSource.withCredentials:",
          eventSource.withCredentials
        );

        // Close the existing connection before attempting to reconnect
        eventSource.close();

        // Retry connection after a delay (e.g., 5 seconds)
        setTimeout(() => {
          setMessages([]); // Clear the state before reconnecting
          createEventSource(); // Attempt to reconnect
        }, 5000);
      };
    };

    createEventSource(); // Initial connection

    // Cleanup on component unmount
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#F5F5F5",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#2E2E2E",
          fontWeight: "bold",
        }}
      >
        Mobicash Hackathon Lab - Microservices Training
      </h1>
      <h5
        style={{ textAlign: "center", marginBottom: "20px", color: "#2E2E2E" }}
      >
        Today's Date: {todayDate}
      </h5>

      <Row className="mb-4">
        <Col md={12}>
          <Card border="info">
            <Card.Body>
              <Card.Title style={{ textAlign: "center", color: "#056517" }}>
                Kafka Messages
              </Card.Title>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Status</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: "white", // White background for the entire row
                      }}
                    >
                      <td>{index + 1}</td>
                      <td
                        style={{
                          backgroundColor: message
                            .toLowerCase()
                            .includes("success")
                            ? "#056517"
                            : "#de1a24",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {message.toLowerCase().includes("success")
                          ? "Success"
                          : "Failure"}
                      </td>
                      <td>{message}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card border="success">
            <Card.Body>
              <Card.Title style={{ textAlign: "center", color: "#056517" }}>
                Transaction Counters
              </Card.Title>
              <Row>
                <Col>
                  <p>Total Transactions: {totalCounter}</p>
                </Col>
                <Col>
                  <p>Success Transactions: {successCounter}</p>
                </Col>
                <Col>
                  <p>Failure Transactions: {failureCounter}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card border="primary">
            <Card.Body>
              <Card.Title style={{ textAlign: "center", color: "#056517" }}>
                Success vs Failure (Pie Chart)
              </Card.Title>
              <PieChart width={300} height={300}>
                <Pie
                  data={[
                    { name: "Success", value: successCounter, fill: "#056517" }, // Green
                    { name: "Failure", value: failureCounter, fill: "#de1a24" }, // Red
                  ]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
              </PieChart>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
