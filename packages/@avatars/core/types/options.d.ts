import { IExprCollection } from './expr/interfaces';
export declare type IDefaultOptions = {
    seed?: string;
    radius?: number;
    r?: number;
    dataUri?: boolean;
    width?: number;
    w?: number;
    height?: number;
    h?: number;
    margin?: number;
    m?: number;
    background?: string;
    b?: string;
};
export declare type IOptions<O extends {}> = O & IDefaultOptions;
export declare function process<O extends {}>(options: IExprCollection<IOptions<O>>): IOptions<O>;
