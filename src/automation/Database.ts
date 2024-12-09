import Keyv from "keyv";
import KeyvSqlite from "@keyv/sqlite";
let db;
const initDatabase = async () => {
    db = new Keyv(new KeyvSqlite(`sqlite://${process.env.DATABASE as string}`), {namespace: "keychain"});
    db!.on("error", (e)=>{
        console.log(e);
        console.log("Database error!");
    });
}

const writeDatabase = (id, data)=>{
    return new Promise((res, rej) => {
        if(db !== null){
            db!.set(id, data).then(res);
        } else {
            rej("NO_DATABASE");
        }
    });
}

const readDatabase = (id)=>{
    return new Promise(async (res, rej) => {
        if(db !== null){
            if(!await db!.has(id)) {
                console.log(`${db} > ${id} > NO_DATA`);
                return res(null);
            }
            db!.get(id).then(data => {
                res(data);
            });
        } else {
            rej("NO_DATABASE");
        }
    });
}

const removeDatabase = (id) => {
    return new Promise((res, rej)=>{
        if(db !== null){
            db!.delete(id).then(()=>{
                res(true);
            });
        } else {
            rej("NO_DATABASE");
        }
    });
}

const rawDatabase = (db) => {
    return db;
}

export {
    initDatabase,
    writeDatabase,
    readDatabase,
    removeDatabase,
    rawDatabase
}