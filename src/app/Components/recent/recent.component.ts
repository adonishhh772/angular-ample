import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';

interface FoodNode {
    name: string;
    children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
    {
        name: 'Fruit',
        children: [
            {name: 'Apple'},
            {name: 'Banana'},
            {name: 'Fruit loops'},
        ]
    }, {
        name: 'Vegetables',
        children: [
            {
                name: 'Green',
                children: [
                    {name: 'Broccoli'},
                    {name: 'Brussels sprouts'},
                ]
            }, {
                name: 'Orange',
                children: [
                    {name: 'Pumpkins'},
                    {name: 'Carrots'},
                ]
            },
        ]
    },
];

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.css']
})
export class RecentComponent implements OnInit {
    treeControl = new NestedTreeControl<FoodNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<FoodNode>();
  constructor() {
      this.dataSource.data = TREE_DATA;
  }

    hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
  }

}