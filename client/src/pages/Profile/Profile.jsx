import React, { Fragment, useEffect, useState } from "react";
import { Progress, Steps, Spin, Space } from "antd";
import axios from "axios";
import MyEvents from "../../components/Profile/MyEvents";
import "./Profile.css";

const { Step } = Steps;

const Profile = () => {
  const [currentCompletion, setCurrent] = useState({
    per: 0,
    cur: 0,
  });
  const [err, setErr] = useState(0);
  const [totalAmt, settotalAmt] = useState(0);
  const [userName, setUserName] = useState();
  const [criteriaDescription, setDescription] = useState();

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_WEB_URL + "/api/users/profile-details", {
        headers: {
          Authorization: `bearer ${localStorage.getItem("usertoken")}`,
        },
      })
      .then((response) => {
        settotalAmt(response.data.moneyOwed);
        setUserName(response.data.rollNo);

        // setting up description of criteria
        let desc = [];
        for (let field in response.data.criteria) {
          response.data.criteria[field]
            ? desc.push(
                <Fragment>
                  <span>{field}</span>
                  <div className="pr-block-gr"></div>
                </Fragment>
              )
            : desc.push(
                <Fragment>
                  <span>{field}</span>
                  <div className="pr-block-rd"></div>
                </Fragment>
              );
        }

        setDescription(desc);
        // checking for criteria
        let isCriteria = Object.values(response.data.criteria).every(
          (val) => val === true
        );
        if (response.data.hasFilledProfile) {
          setCurrent({ per: 33, cur: 1 });
          if (isCriteria) {
            setCurrent({ per: 66, cur: 2 });
            if (response.data.moneyOwed === 0) {
              setCurrent({ per: 100, cur: 3 });
            }
          }
        }
      })
      .catch((e) => setErr(1));
  }, []);
  const paidDescription = `Payment for events!`;
  return (
    <Fragment>
      {err ? (
        <Space size="middle" style={{ height: "50vh", marginLeft: "46%" }}>
          <Spin size="large" />
        </Space>
      ) : (
        <div>
          <div className="p-title-nam">Welcome, {userName}</div>
          <div className="p-main">
            <div className="p-circBar">
              <Progress type="circle" percent={currentCompletion.per} />
            </div>
            <div className="p-steps">
              <Steps
                current={currentCompletion.cur}
                responsive={true}
                direction={"vertical"}
              >
                <Step
                  title="Update Profile"
                  description="Fill the form to update your name and phone no!"
                />
                <Step
                  title="Meet Criterion"
                  description={
                    <div className="pr-block-main">{criteriaDescription}</div>
                  }
                />
                <Step title={`₹ ${totalAmt}`} description={paidDescription} />
              </Steps>
            </div>
          </div>
        </div>
      )}

      <MyEvents />
    </Fragment>
  );
};

export default Profile;
