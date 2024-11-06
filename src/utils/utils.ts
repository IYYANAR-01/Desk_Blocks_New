import { DB } from "../lib/util";

export async function getLayoutList() {
    const payload:RequestOptions = {
        url: `https://desk.zoho.com/api/v1/layouts?module=tickets`,
        headers: {},
        type: "GET",
        data: {},
        connectionLinkName: "checklist_app",
        responseType: "json",
    };
    let { data } = await ZOHODESK.request(payload);
    console.log({data});
    let list = data.statusMessage.data || [];
    return list.reduce((acc:any, cur:any) => {
        const { layoutName, id } = cur;
        acc[`${id}`] = {
            text: layoutName,
            id
        }
        return acc;
    }, {});
}

export async function getCheckList () {
    const data = await DB.get({
        key: "checkList",
        queriableValue: "checkList_layout",
        from: 0,
    });
    return data["database.get"].data[0].value;
};

export async function setCheckList (value:any) {
    return await DB.set({ key: "checkList", value, queriableValue: "checkList_layout" });
}

export async function getTicket(id:number) {
    const payload:RequestOptions = {
        url: `https://desk.zoho.com/api/v1/tickets/${id}?include=contacts,products,assignee,departments,team`,
        headers: {},
        type: "GET",
        data: {},
        connectionLinkName: "checklist_app",
        responseType: "json",
    };
    let { data } = await ZOHODESK.request(payload);
    console.log(data.statusMessage.layoutId);
    return data.statusMessage.layoutId;
}

export async function getCheckList_ticket (id:number) {
    const data = await DB.get({
        key: `${id}`,
        queriableValue: "checkList_ticket",
        from: 0,
    });
    return data["database.get"].data[0].value.data;
};

export async function setCheckList_ticket (key:number ,value:any) {
    return await DB.set({ key: `${key}`, value: { data: value }, queriableValue: "checkList_ticket" });
}