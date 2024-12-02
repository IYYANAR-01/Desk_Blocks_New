import { DB } from "../lib/util";
import type { CHECKLIST_TYPE, LAYOUTDATA_TYPE } from "../widget1/constants";

export async function getLayoutList(domain:string="https://desk.zoho.com") {
    const payloadLayout:RequestOptions = {
        url: `${domain}/api/v1/layouts?module=tickets`,
        headers: {},
        type: "GET",
        data: {},
        connectionLinkName: "checklist_app",
        responseType: "json",
    };
    const payloadDept:RequestOptions = {
        url: `${domain}/api/v1/departments?isEnabled=true`,
        headers: {},
        type: "GET",
        data: {},
        connectionLinkName: "checklist_app",
        responseType: "json",
    };
    let { data } = await ZOHODESK.request(payloadLayout);
    let list = data.statusMessage.data || [];

    let  departments = await ZOHODESK.request(payloadDept);
    let departList = departments.data.statusMessage.data.map(({id}: { id:string }) => id)

    type layoutData = {
        layoutName:string, 
        departmentId:string
        id:string, 
    }
    return list.reduce((acc:LAYOUTDATA_TYPE, cur:layoutData) => {
        const { layoutName, id, departmentId } = cur;
        if(departList.includes(departmentId)) {
            acc[`${id}`] = {
                text: layoutName,
                departmentId,
                id
            };
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
    return data["database.get"].data ? data["database.get"].data[0].value : {};
};

export async function setCheckList (value:CHECKLIST_TYPE) {
    return await DB.set({ key: "checkList", value, queriableValue: "checkList_layout" });
}

export async function getTicket(id:number, domain:string="https://desk.zoho.com") {
    const payload:RequestOptions = {
        url: `${domain}/api/v1/tickets/${id}?include=contacts,products,assignee,departments,team`,
        headers: {},
        type: "GET",
        data: {},
        connectionLinkName: "checklist_app",
        responseType: "json",
    };
    let { data } = await ZOHODESK.request(payload);
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

export async function setCheckList_ticket (key:number, value:{ text: string, isChecked: boolean }[]) {
    return await DB.set({ key: `${key}`, value: { data: value }, queriableValue: "checkList_ticket" });
}