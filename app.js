import scloudjs from "scloudjs"; //scloudjsをモジュールとして使えるようにする
import fetch from "node-fetch";
import shortid from "shortid";

let clouddatas = new Object(); //このオブジェクトにクラウド変数のデータが入る
let chars = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "-",
  "_",
  ",",
  ".",
  " ",
];

function stringToNumber(string) {
    let _string = string.toLowerCase();
    let output = "";
    for (let i = 0; i < _string.length; i++) {
        output += (chars.indexOf(_string[i]) + 1).toString();
    }
    return output;
}

function numberToString(number) {
    let output = "";
    for (let i = 0; i < number.length; i += 2) {
        output += chars[Number(number[i] + number[i + 1]) - 1];
    }
    return output;
}

function getJsonValue(feDa, arr) {
    let output = feDa;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] in output) {
            output = output[arr[i]];
        } else {
            output = "";
            break;
        }
    }
    return output;
}

function oldnow(olddate, nowdate) {
    let _old = new Date(olddate);
    let _new = new Date(nowdate);
    return (_new - _old) / (60 * 60 * 24);
}

function comp(code) {
    let output = "";
    for (let i = 0; i < code.length; i += 1) {
        output += chars[10 + chars.length - chars.indexOf(code[i]) - 2];
    }
    return output;
}
async function messageComment() {
    let logi = await fetch("https://scratch.mit.edu/accounts/login/", {
        method: "POST",
        body: JSON.stringify({
            "username": process.env.username,
            "password": process.env.password,
            "useMessages": false
        }),
        "headers": {
            "x-csrftoken": "a",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "scratchcsrftoken=a",
            "user-agent": "",
            "referer": "https://scratch.mit.edu"
        }
    });
    let sessionid = logi.headers.get("set-cookie").match(/\"(.*)\"/g)[0];
    let aaa = await logi.json()
    let sessiontoken = aaa[0].token;
    let uname = aaa[0].username;
    let messagesCount = (await (await fetch("https://scratch.mit.edu/messages/ajax/get-message-count/", {
        headers: {
            "x-requested-with": "XMLHttpRequest",
            "referer": "https://scratch.mit.edu",
            "cookie": "scratchsessionsid=" + sessionid + ";scratchcsrftoken=a;"
        }
    })).json()).msg_count
    let messages = await (await fetch(`https://api.scratch.mit.edu/users/${uname}/messages?limit=${messagesCount}&offset=0`, {
        headers: {
            "x-token": sessiontoken
        }
    })).json();

    //return;
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].type !== "addcomment") {
            continue
        }
        if (messages[i].comment_type == 1 & messages[i].actor_username == "yamaguchi03" & messages[i].comment_obj_title == "yamaguchi04" & messages[i].comment_fragment.split(" ")[0] == "/del") {
            let historyId = messages[i].comment_fragment.split(" ")[1]
            let project_token = (await (await fetch(`https://api.scratch.mit.edu/projects/${process.env.toproject}`, {
                headers: {
                    "x-token": sessiontoken
                }
            })).json()).project_token;
            let d = await (await fetch(`https://projects.scratch.mit.edu/${process.env.toproject}?token=${project_token}`)).json();
            let history = d.targets[0].lists["d@mQRsxVTU(X/Y:_qYl)"][1];
            let index = 0;
            let kakunin = false;
            while (index < history.length) {
                if (history[index].replace("ID:", "").split(" ")[0] == historyId) {
                    history.splice(index, 1);
                    kakunin = true;
                    continue;
                } else {
                    index++;
                }
            }
            let taikyoku = d.targets[0].lists["b@?8I|crW(Uu(uhrHD|g"][1];
            taikyoku.splice(taikyoku.indexOf(historyId), 2)
            if (!kakunin) {
                continue
            }
            d.targets[0].lists["d@mQRsxVTU(X/Y:_qYl)"][1] = history;
            d.targets[0].lists["b@?8I|crW(Uu(uhrHD|g"][1] = taikyoku;
            let c = await fetch(
                `https://projects.scratch.mit.edu/${process.env.toproject}`, {
                    method: "PUT",
                    body: JSON.stringify(d),
                    headers: {
                        "content-type": "application/json",
                        referer: "https://scratch.mit.edu",
                        cookie: "scratchsessionsid=" + sessionid + ";scratchcsrftoken=a;",
                    },
                }
            );
            console.log(c.status);
            console.log("Deleted from comment.");
            let username = "yamaguchi04";
            let id = messages[i].comment_id;
            (async () => {
                let res = await fetch(`https://scratch.mit.edu/site-api/comments/user/${username}/del/`, {
                    method: "POST",
                    body: `{
    id:${id}
  }`,
                    headers: {
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
                        "x-csrftoken": "a",
                        "x-requested-with": "XMLHttpRequest",
                        "referer": "https://scratch.mit.edu",
                        "cookie": `scratchcsrftoken=a; scratchsessionid=${sessionid}; scratchlanguage=en;`,
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                      "x-token":sessiontoken
                    }
                });
                console.log(await res.status)
            })()
            //ここまでですよ
        }
    }
}
messageComment()
const a = setInterval(messageComment, 60000);
const messages = async (data) => {
    const temp = scloudjs.parsedata(data, clouddatas); //受け取ったメッセージを整理する
    clouddatas = temp.clouddatas; //クラウド変数のデータ
    const changedlists = temp.changedlists;
    if (changedlists.includes("request")) {
        console.log("========" + clouddatas["request"].value);
        //await fetch("https://scratch.mit.edu/accounts/logout/",{method:"POST","headers":{"x-csrftoken":"a","cookie":"scratchcsrftoken=a;",referer:"https://scratch.mit.edu"}});
        let logi = await fetch("https://scratch.mit.edu/accounts/login/", {
            method: "POST",
            body: JSON.stringify({
                username: process.env.username,
                password: process.env.password,
                useMessages: true,
            }),
            headers: {
                "x-csrftoken": "a",
                "x-requested-with": "XMLHttpRequest",
                cookie: "scratchcsrftoken=a",
                "user-agent": "",
                referer: "https://scratch.mit.edu",
            },
        });
        let sessionid = logi.headers.get("set-cookie").match(/\"(.*)\"/g)[0];
        let aiueo = await logi.json();
        let sessiontoken = aiueo[0]["token"];
        let project_token = (
            await (
                await fetch(
                    `https://api.scratch.mit.edu/projects/${process.env.toproject}`, {
                        headers: {
                            "x-token": sessiontoken
                        }
                    }
                )
            ).json()
        ).project_token;
        //
        let d = await (
            await fetch(
                `https://projects.scratch.mit.edu/${process.env.toproject}?token=${project_token}`
            )
        ).json();
        let array = numberToString(clouddatas["request"].value.toString() + clouddatas["request2"].value.toString()).split(",");
        console.log(array);
        if (array[0] == array[1]) {
            scloudjs.sendtocloud("response", stringToNumber("onaji"));
            return;
        }
        let now = new Date();
        now.setHours(now.getHours() + 9);
        let years = now.getFullYear();
        let monthes = now.getMonth() + 1;
        let today = now.getDate();
        let youbi = now.getDay();
        let hours = now.getHours();
        let mins = ("00" + now.getMinutes()).slice(-2);
        let secs = ("00" + now.getSeconds()).slice(-2);
        let nowDate = `${years}/${monthes}/${today} ${hours}:${mins}:${secs}`;
        if (
            oldnow(array[array.length - 1].replace(/-/g, "/").replace(/_/g, ":"), nowDate) > 0.05
        ) {
            console.log("it is old request.", oldnow(array[array.length - 1].replace(/-/g, "/").replace(/_/g, ":"), nowDate));
            return;
        }
        let projectar = d.targets[0].lists[";]IC!BAM]Ldm9}?)XkXK"][1];
        /*function winnerS() {
          if (projectar.includes(array[0])) {
            let temp = projectar[projectar.indexOf(array[0]) + 1].split("/");
            let rateOther;
            if (projectar.includes(array[1])) {
              rateOther = projectar[projectar.indexOf(array[1]) + 1].split("/")[3];
            } else {
              rateOther = "1500";
            }
            if (oldnow(temp[2].replace(/-/g, "/"), nowDate) < 0.1) {
              console.log("Too many requests.");
              return;
            }
            temp[0] = Number(temp[0]) + 1;
            temp[1] = Number(temp[1]) + 1;
            temp[2] = `${nowDate.replace(/\//g, "-")}`;
            temp[3] = Math.floor(
              Number(temp[3]) + (Number(rateOther) / Number(temp[3])) * 70
            );
            projectar[
              projectar.indexOf(array[0]) + 1
            ] = `${temp[0]}/${temp[1]}/${temp[2]}/${temp[3]}`;
          } else {
            projectar.push(array[0]);
            projectar.push(`1/1/${nowDate.replace(/\//g, "-")}/1500`);
          }
        }
        winnerS();
        if (projectar.includes(array[1])) {
          let temp = projectar[projectar.indexOf(array[1]) + 1].split("/");
          let rateOther;
          if (projectar.includes(array[0])) {
            rateOther = projectar[projectar.indexOf(array[0]) + 1].split("/")[3];
          } else {
            rateOther = "1500";
          }
          if (oldnow(temp[2].replace(/-/g, "/"), nowDate) < 0.1) {
            console.log("Too many requests." + temp);
            return;
          }
          temp[1] = Number(temp[1]) + 1;
          temp[2] = `${nowDate.replace(/\//g, "-")}`;
          temp[3] = Math.floor(
            Number(temp[3]) - (Number(temp[3]) / Number(rateOther)) * 70
          );
          projectar[
            projectar.indexOf(array[1]) + 1
          ] = `${temp[0]}/${temp[1]}/${temp[2]}/${temp[3]}`;
        } else {
          projectar.push(array[1]);
          projectar.push(`0/1/${nowDate.replace(/\//g, "-")}/1500`);
        }
        //ここまでセーブの内容*/
        let list1 = d.targets[0].lists["d@mQRsxVTU(X/Y:_qYl)"][1];
        let strn = list1[0];
        let list2 = strn.split(" ");
        list2[6] = list2[6] + " " + list2[7];
        list2.splice(7, 1);
        list2[6] = list2[6].replace(/-/g, "/");
        if (oldnow(list2[6], nowDate) < 0.1) {
            console.log("Too many requests.");
            return;
        }
        d.targets[0].lists[";]IC!BAM]Ldm9}?)XkXK"][1] = projectar;
        let generatedId = shortid.generate();
        d.targets[0].lists["d@mQRsxVTU(X/Y:_qYl)"][1].unshift(
            "ID:" +
            generatedId +
            " ｜ " +
            `${array[0]} VS ${array[1]} - ${nowDate}`
        );
        d.targets[0].lists["b@?8I|crW(Uu(uhrHD|g"][1].push(
            generatedId
        );
        d.targets[0].lists["b@?8I|crW(Uu(uhrHD|g"][1].push(
            `${array[0]},${array[1]},${array[2]},${array[3]},${nowDate}`
        );
        let c = await fetch(
            `https://projects.scratch.mit.edu/${process.env.toproject}`, {
                method: "PUT",
                body: JSON.stringify(d),
                headers: {
                    "content-type": "application/json",
                    referer: "https://scratch.mit.edu",
                    cookie: "scratchsessionsid=" + sessionid + ";scratchcsrftoken=a;",
                },
            }
        );
        console.log(c.status);
        console.log("Saved.");
        scloudjs.sendtocloud("response", stringToNumber("ok"));
    }
};

const message = async () => {};
scloudjs.setdatas(
    process.env.username,
    process.env.password,
    process.env.projectid,
    messages
); //いろいろデータを設定する
const func = async () => {
    await scloudjs.login()
    await scloudjs.connect(); //scratchのクラウド変数サーバーに接続
    await scloudjs.handshake();
    let now = new Date();
    now.setHours(now.getHours() + 9);
    let years = now.getFullYear();
    let monthes = now.getMonth() + 1;
    let today = now.getDate();
    let youbi = now.getDay();
    let hours = now.getHours();
    let mins = ("00" + now.getMinutes()).slice(-2);
    let secs = ("00" + now.getSeconds()).slice(-2);
    let nowDate = `${years}/${monthes}/${today} ${hours}:${mins}:${secs}`;
    console.log("Lanched" + " at " + nowDate);
};
func();

const set = setInterval(func, 10000);
import http from "http";
http
    .createServer(function(req, res) {
        res.write("kokonihananimonaiyowwwwwww");
        res.end();
    })
    .listen(8080);
