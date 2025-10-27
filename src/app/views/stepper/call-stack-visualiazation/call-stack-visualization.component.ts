import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import * as echarts from 'echarts';

interface FlowNode {
  id: number;
  type: 'source' | 'path' | 'sink';
  name: string;
  location: string;
  label: string;
  method?: string;
  dataType?: string;
  returnType?: string;
  code: string;
  badge: string;
  vulnerable?: boolean;
}

@Component({
  selector: 'app-call-stack-visualization',
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatExpansionModule
  ],
  templateUrl: './call-stack-visualization.component.html',
  styleUrl: './call-stack-visualization.component.css',
})
export class CallStackVisualizationComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  selectedNodeId: number | null = null;
  chart: any;

  flowData = {
    id: 'flow-001',
    severity: 'CRITICAL',
    summary: 'UserController.java:45 → UserRepository.java:78 (5 steps)',
    nodes: [
      {
        id: 1,
        type: 'source' as const,
        name: 'getParameter',
        location: 'UserController.java:45',
        label: 'CALL',
        method: 'javax.servlet.http.HttpServletRequest.getParameter',
        dataType: 'java.lang.String',
        code: 'request.getParameter("id")',
        badge: 'SOURCE'
      },
      {
        id: 2,
        type: 'path' as const,
        name: 'userId',
        location: 'UserController.java:45',
        label: 'IDENTIFIER',
        dataType: 'java.lang.String',
        code: 'userId',
        badge: 'STEP 1'
      },
      {
        id: 3,
        type: 'path' as const,
        name: 'findUser',
        location: 'UserController.java:48',
        label: 'CALL',
        method: 'com.example.service.UserService.findUser',
        code: 'userService.findUser(userId)',
        badge: 'STEP 2'
      },
      {
        id: 4,
        type: 'path' as const,
        name: 'userId',
        location: 'UserService.java:32',
        label: 'IDENTIFIER',
        dataType: 'java.lang.String',
        code: 'userId',
        badge: 'STEP 3'
      },
      {
        id: 5,
        type: 'sink' as const,
        name: 'executeQuery',
        location: 'UserRepository.java:78',
        label: 'CALL',
        method: 'java.sql.Statement.executeQuery',
        returnType: 'java.sql.ResultSet',
        code: 'statement.executeQuery(query)',
        badge: 'SINK',
        vulnerable: true
      }
    ]
  };

  ngOnInit() {
    // Ініціалізація компонента
  }

  ngAfterViewInit() {
    this.initChart();
  }

  initChart() {
    this.chart = echarts.init(this.chartContainer.nativeElement);

    const nodes = this.flowData.nodes.map((node, index) => ({
      id: node.id.toString(),
      name: node.name,
      x: 400,
      y: index * 120 + 50,
      symbolSize: 80,
      itemStyle: {
        color: this.getNodeColor(node.type),
        borderWidth: 4,
        borderColor: '#fff',
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      },
      label: {
        show: true,
        formatter: `{name|${node.name}}\n{location|${node.location}}`,
        rich: {
          name: {
            fontSize: 14,
            fontWeight: 'bold',
            fontFamily: 'Courier New',
            color: '#fff',
            padding: [0, 0, 5, 0]
          },
          location: {
            fontSize: 10,
            color: 'rgba(255, 255, 255, 0.8)',
            fontFamily: 'Roboto'
          }
        }
      },
      category: node.type
    }));

    const links = this.flowData.nodes.slice(0, -1).map((node, index) => ({
      source: node.id.toString(),
      target: this.flowData.nodes[index + 1].id.toString(),
      lineStyle: {
        color: '#bdbdbd',
        width: 3,
        type: 'solid',
        curveness: 0
      },
      label: {
        show: true,
        formatter: 'tainted data flows',
        fontSize: 10,
        color: '#9e9e9e'
      }
    }));

    const option = {
      title: {
        text: 'Data Flow Visualization',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            const node = this.flowData.nodes[params.dataIndex];
            return `
              <div style="padding: 8px;">
                <strong>${node.name}</strong><br/>
                <span style="color: #757575;">${node.location}</span><br/>
                <span style="color: #1976d2;">${node.badge}</span>
              </div>
            `;
          }
          return '';
        }
      },
      series: [
        {
          type: 'graph',
          layout: 'none',
          coordinateSystem: null,
          symbolSize: 80,
          roam: true,
          label: {
            show: true,
            position: 'inside'
          },
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: [0, 15],
          data: nodes,
          links: links,
          lineStyle: {
            opacity: 0.9,
            width: 3,
            curveness: 0
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 5
            },
            itemStyle: {
              borderWidth: 6
            }
          }
        }
      ]
    };

    this.chart.setOption(option);

    this.chart.on('click', (params: any) => {
      if (params.dataType === 'node') {
        this.selectNode(params.data.id);
      }
    });

    window.addEventListener('resize', () => {
      this.chart?.resize();
    });
  }

  selectNode(nodeId: number | string) {
    this.selectedNodeId = typeof nodeId === 'string' ? parseInt(nodeId) : nodeId;

    if (this.chart) {
      this.chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: this.selectedNodeId - 1
      });
    }
  }

  getNodeIcon(type: string): string {
    switch (type) {
      case 'source': return 'input';
      case 'sink': return 'output';
      default: return 'code';
    }
  }

  getNodeColor(type: string): string {
    switch (type) {
      case 'source': return '#1976d2';
      case 'sink': return '#d32f2f';
      default: return '#9e9e9e';
    }
  }
}
