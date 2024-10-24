import { DB } from "../../lib/util";

export async function getLayoutList() {
    const payload:RequestOptions = {
        url: `https://desk.zoho.com/api/v1/layouts?module=tickets`,
        headers: {},
        type: "GET",
        data: {},
        connectionLinkName: "checklist_app",
        responseType: "json",
    };
    let layoutData = await ZOHODESK.request(payload);
    console.log({layoutData});
    let list = layoutData.data.statusMessage.data || [];
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
        queriableValue: "checkList_extension",
        from: 0,
    });
    return data["database.get"];
};