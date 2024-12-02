import { DEFAULT_GLOBAL_CHECKLIST_DATA } from "../../constants";

export type LAYOUTDATA_TYPE = {
    [key: string]: {
        text: string;
        id: string;
        departmentId: string;
    };
};

export type CHECKLIST_TYPE = {
    [key: string]: {
        text: string;
        isChecked: boolean
    }[];
}

export type DATA_TYPE = {
    layoutList?: LAYOUTDATA_TYPE;
    checklistData: CHECKLIST_TYPE;
    activeTemplate: string;
    isSaved: boolean
};

export const DEFAULT_DATA:CHECKLIST_TYPE = {
    default: [...DEFAULT_GLOBAL_CHECKLIST_DATA]
};

export const CONTEXT_NAME:string = "global_checklist_data";