import { v4 as uuidv4 } from "uuid";
import { FunctionNode } from "../../features/dashboard/models/dashboard.models";

export interface AccordionItem {
  id: string;
  title: string;
  percentage?: number;
  children?: AccordionItem[];
  assetState?: "Operational" | "Compromised" | "Maintenance" | "Turned Off";
  isExpanded?: boolean;
}

export function assignIds(item: AccordionItem): AccordionItem {
  item.id = uuidv4();
  if (item.children) {
    item.children = item.children.map((child) => assignIds(child));
  }
  return item;
}

export interface CyberResilienceResponse {
  functions: CyberResilienceFunctions[];
}

export interface CyberResilienceFunctions {
  id: number;
  name: string;
  description: string;
  operatingPercentage: number;
  creationDate: string;
  assets?: CyberResilienceAsset[];
  updateDate?: string;
  parent?: CyberResilienceParent;
}

export interface CyberResilienceAsset {
  pieceMark: string;
  status: string;
  name: string;
}

export interface CyberResilienceParent {
  id: number;
  name: string;
  description: string;
  operatingPercentage: number;
  creationDate: string;
  updateDate?: string;
  parent?: CyberResilienceParent;
}

function convertLeafLevels(node: any): any[] {
  const outputChildren: any[] = [];
  if (
    node &&
    node?.assets &&
    node?.assets?.length &&
    node?.children &&
    !node?.children?.length
  ) {
    node.assets?.forEach((asset: { pieceMark: any; name: any; status: any }) => {
      const newChild: any = {
        id: asset.pieceMark,
        title: asset.name,
        assetState: asset.status,
      };

      outputChildren.push(newChild);
    });
  }

  return outputChildren;
}

function getNodeChildren(node: any): AccordionItem[] {
  let convertedChidren: AccordionItem[] = [];

  if (node?.children && node?.children.length) {
    convertedChidren = [...mapFunctionNodesToAccordionItems(node.children)];
  } else if (
    node &&
    node?.assets &&
    node?.assets?.length &&
    node?.children &&
    !node?.children?.length
  ) {
    convertedChidren = [...(convertLeafLevels(node) as AccordionItem[])];
  }

  return convertedChidren;
}

export function mapFunctionNodesToAccordionItems(
  nodes: any[]
): AccordionItem[] {
  return nodes.map((node) => {
    const accordionItem: AccordionItem = {
      id: node.id.toString(),
      title: node.name,
      percentage: node?.operatingPercentage,
      isExpanded: false,
      children: getNodeChildren(node),
    };

    return accordionItem;
  });
}
