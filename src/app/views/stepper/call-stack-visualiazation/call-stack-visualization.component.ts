
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';

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
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatExpansionModule
  ],
  templateUrl: './call-stack-visualization.component.html',
  styleUrls: ['./call-stack-visualization.component.scss']
})
export class CallStackVisualizationComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  selectedNodeId: number | null = null;
  chart: ECharts | null = null;
  private resizeObserver: ResizeObserver | null = null;

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
    // Component initialization
  }

  ngAfterViewInit() {
    this.initChart();
    this.setupResizeObserver();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      this.chart?.resize();
    });

    if (this.chartContainer?.nativeElement) {
      this.resizeObserver.observe(this.chartContainer.nativeElement);
    }
  }

  initChart() {
    if (!this.chartContainer?.nativeElement) return;

    this.chart = echarts.init(this.chartContainer.nativeElement);

    const spacing = 100;
    const startY = 60;

    const nodes = this.flowData.nodes.map((node, index) => ({
      id: node.id.toString(),
      name: node.name,
      x: 250,
      y: startY + index * spacing,
      symbolSize: 70,
      itemStyle: {
        color: this.getNodeColor(node.type),
        borderWidth: 3,
        borderColor: '#fff',
        shadowBlur: 8,
        shadowColor: 'rgba(0, 0, 0, 0.2)'
      },
      label: {
        show: true,
        formatter: '{name|}',
        rich: {
          name: {
            fontSize: 13,
            fontWeight: 'bold',
            fontFamily: 'Courier New, monospace',
            color: '#fff',
            align: 'center'
          }
        },
        position: 'inside'
      },
      emphasis: {
        scale: 1.15,
        itemStyle: {
          borderWidth: 5,
          shadowBlur: 15
        }
      }
    }));

    const links = this.flowData.nodes.slice(0, -1).map((node, index) => ({
      source: node.id.toString(),
      target: this.flowData.nodes[index + 1].id.toString(),
      lineStyle: {
        color: '#90a4ae',
        width: 2.5,
        type: 'solid',
        curveness: 0
      },
      emphasis: {
        lineStyle: {
          width: 4,
          color: '#607d8b'
        }
      }
    }));

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            const node = this.flowData.nodes[params.dataIndex];
            return `
              <div style="padding: 8px; max-width: 300px;">
                <strong style="font-family: 'Courier New', monospace;">${node.name}</strong><br/>
                <span style="color: #757575; font-size: 12px;">${node.location}</span><br/>
                <span style="color: ${this.getNodeColor(node.type)}; font-size: 11px; font-weight: 600; margin-top: 4px; display: inline-block;">${node.badge}</span>
              </div>
            `;
          }
          return '';
        },
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        }
      },
      series: [{
        type: 'graph',
        layout: 'none',
        coordinateSystem: null,
        symbolSize: 70,
        roam: false,
        label: {
          show: true
        },
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: [0, 12],
        data: nodes,
        links: links,
        lineStyle: {
          opacity: 0.85,
          width: 2.5
        },
        emphasis: {
          focus: 'adjacency',
          scale: true
        },
        animation: true,
        animationDuration: 800,
        animationEasing: 'cubicOut'
      }]
    };

    this.chart.setOption(option);

    this.chart.on('click', (params: any) => {
      if (params.dataType === 'node') {
        this.selectNode(parseInt(params.data.id));
      }
    });
  }

  selectNode(nodeId: number) {
    this.selectedNodeId = nodeId;

    if (this.chart) {
      this.chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: nodeId - 1
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
      default: return '#757575';
    }
  }
}
