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