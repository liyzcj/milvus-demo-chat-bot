import {
  CircularProgress, Divider,

  Snackbar, TextareaAutosize
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowForward } from "@material-ui/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { queryContext } from "../contexts/QueryContext";
import { texts } from "../lan";

const lanKey = window._env_ && window._env_.LAN === "cn" ? "cn" : "en";
const { tip, week, placeholder, notEmpty , answerHint, questionNotFound} = texts[lanKey];


const QA = (props) => {
  const textArea = useRef(null);
  const resultContainer = useRef(null);
  const [time, setTime] = useState("");
  const [qaList, setQaList] = useState([
    {
      type: "answer",
      text: tip,
    },
  ]);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const isMobile = props.isMobile;
  const { search } = useContext(queryContext);
  const { answer } = useContext(queryContext);

  const useStyles = makeStyles({
    wrapper: {
      display: "flex",
      width: "100%",
      flex: 1,
      flexDirection: "column",
    },
    content: {
      flex: 1,
      maxHeight: "calc(100vh - 8rem - 340px)",
      overflowY: "auto",
      color: "#000",
      padding: isMobile ? "20px" : "40px",
      fontSize: isMobile ? "12px" : "15px",
    },
    textarea: {
      position: "relative",
      flex: "0 0 154px",
      padding: "20px",
      backgroundColor: "#fff",
      borderTop: "1px solid #B0B0B9",
      "& :focus": {
        outline: "none",
      },
    },
    item: {
      display: "flex",
      marginTop: "16px",
    },
    avatar: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundSize: "66px",
      backgroundPosition: "center",
      backgroundImage: `url(
        "./daoyou.png"
      )`,
    },
    text: {
      position: "relative",
      display: "flex",
      marginLeft: "20px",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: "14px 21px",
      maxWidth: "300px",
      lineHeight: 1.6,
      color: "#000",
      borderRadius: "10px",
      ".question &": {
        backgroundColor: "#C7EDFF",
      },
      ".answer &": {
        backgroundColor: "#E5E5E5",
      },
      "& p": {
        maxWidth: "100%",
      },
    },
    send: {
      position: "absolute",
      bottom: "20px",
      right: "30px",
      height: "60px",
      width: "60px",
      color: "#B0B0B9",
      cursor: "pointer",
    },
    triangle: {
      position: "absolute",
      top: "16px",
      width: 0,
      height: 0,
      borderTop: "10px solid transparent",
      borderBottom: "10px solid transparent",
      ".question &": {
        borderLeft: "10px solid #AEE5FF",
      },
      ".answer &": {
        borderRight: "10px solid #fff",
      },
    },
  });
  const classes = useStyles({});

  const handleClick = (e) => {
    e.preventDefault();
    setQaList((list) => {
      return [
        ...list,
        { type: "answer", loading: true, text: "" },
      ];
    });

    answer(e.target.text).then((res) => {
      const { status, data } = res || {};
      if (status === 200 ) {

        setQaList((list) => {
          return list.map((v) => {
            if (v.loading) {
              v.loading = false;
              v.text = data.msg;
            }
            return v;
          });
        });
      }
    })
  }

  function QuestionList(props) {

    if (typeof props.questions == "string") {
      return questionNotFound
    }
    let i = 0;
    const questionList = props.questions.map((question) => (
      <li key={i++}>
        <a href="/#" onClick={handleClick}>{question}</a>
      </li>)
    )
    return (
      <div>
        {answerHint}
        <ol>
          {questionList}
        </ol>
      </div>
    )
  }

  const handleSend = (e) => {
    const value = textArea.current.value;
    if (!value.trim()) {
      setMessage(notEmpty);
      setOpen(true);

      setTimeout(() => {
        setOpen(false);
      }, 800);
      return;
    }
    setQaList((list) => {
      let text = textArea.current.value;
      textArea.current.value = "";
      return [
        ...list,
        { type: "question", text },
        { type: "answer", loading: true, text: "" },
      ];
    });

    search(value).then((res) => {
      const { status, data } = res || {};
      if (status === 200 ) {

        setQaList((list) => {
          return list.map((v) => {
            if (v.loading) {
              v.loading = false;
              v.text = <QuestionList questions = {data.msg} />;
            }
            return v;
          });
        });
      }
    });
  };

  useEffect(() => {
    const addZero = (num) => (num < 10 ? `0${num}` : num);
    const getTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = addZero(now.getMonth() + 1);
      const day = addZero(now.getDay());
      const date = now.getDate();
      const hour = addZero(now.getHours());
      const minutes = addZero(now.getMinutes());
      const seconds = addZero(now.getSeconds());
      console.log(week, day);
      return `${year}/${month}/${date}  ${
        week[parseInt(day)]
      } ${hour}:${minutes}:${seconds}`;
    };
    setTime(getTime());
  }, []);

  useEffect(() => {
    resultContainer.current.scrollTop = 10000;
  }, [qaList]);

  const handleKeyDown = (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 13) {
      handleSend();
      e.preventDefault();
    }
  };

  return (
    <div className={classes.wrapper}>
      <div ref={resultContainer} className={classes.content}>
        {/* <p>该 AI 问答系统包含12万条医疗相关的问答。</p>
        <p> 在下方对话框中输入问题，你的健康管家小M将会给出回答。</p> */}
        {/* <p style={{ color: "#B0B0B9" }}>（Demo 仅支持中文问答）</p> */}
        <p style={{ textAlign: "center" }}>{time}</p>
        {qaList.map((v, i) => {
          if (v.type === "answer") {
            return (
              <div className={`${classes.item} answer`} key={i}>
                <div className={classes.avatar}></div>
                <div className={classes.text}>
                  <div
                    className={`${classes.triangle}`}
                    style={{ left: "-10px" }}
                  ></div>
                  {v.loading ? (
                    <CircularProgress
                      style={{ color: "#333" }}
                    ></CircularProgress>
                  ) : (
                    <div>{v.text}</div>
                  )}
                </div>
              </div>
            );
          } else {
            return (
              <div
                className={`${classes.item} question`}
                style={{ flexDirection: "row-reverse" }}
                key={i}
              >
                {/* <AccountCircleIcon style={{ fontSize: 50 }} /> */}
                <div className={classes.text} style={{ margin: "0 20px 0 0" }}>
                  {/* <div
                    className={classes.triangle}
                    style={{ right: "-10px" }}
                  ></div> */}
                  <p>{v.text}</p>
                </div>
              </div>
            );
          }
        })}
      </div>
      <Divider
        variant="middle"
        style={{ backgroundColor: "#fff", margin: " 0" }}
      />
      <div className={classes.textarea}>
        <TextareaAutosize
          ref={textArea}
          aria-label="empty textarea"
          placeholder={placeholder}
          rows={8}
          style={{
            width: "100%",
            boxSizing: "border-box",
            border: "none",
            color: "#000",
            fontFamily: "Roboto",
            fontSize: "15px",
          }}
          onKeyDown={handleKeyDown}
        />
        <div className={classes.send}>
          <ArrowForward fontSize="large" onClick={handleSend}></ArrowForward>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        key="top center"
        open={open}
        message={message}
      />
    </div>
  );
};

export default QA;
