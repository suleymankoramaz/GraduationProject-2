import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
    BarSeries,
    CandlestickSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
    CrossHairCursor,
    EdgeIndicator,
    MouseCoordinateX,
    MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { ema, macd } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { TrendLine, DrawingObjectSelector } from "react-stockcharts/lib/interactive";
import { last, toObject } from "react-stockcharts/lib/utils";

import {
    saveInteractiveNodes,
    getInteractiveNodes,
} from "./interactiveutils";

class CandlestickChart extends React.Component {
    constructor(props) {
        super(props);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onDrawCompleteChart1 = this.onDrawCompleteChart1.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.addPattern = this.addPattern.bind(this);
        this.saveInteractiveNodes = saveInteractiveNodes.bind(this);
        this.getInteractiveNodes = getInteractiveNodes.bind(this);

        this.saveCanvasNode = this.saveCanvasNode.bind(this);
        this.state = {
            enableTrendLine: false,
            trends_1: [
                // { start: [1606, 49], end: [1711, 56], appearance: { stroke: "green" }, type: "XLINE" },
                // { start: [1606, 53], end: [1714, 61], appearance: { stroke: "red" }, type: "XLINE" }
            ]
        };
    }
    saveCanvasNode(node) {
        this.canvasNode = node;
    }
    componentDidMount() {
        document.addEventListener("keyup", this.onKeyPress);
    }
    componentWillUnmount() {
        document.removeEventListener("keyup", this.onKeyPress);
    }
    handleSelection(interactives) {
        const state = toObject(interactives, each => {
            return [
                `trends_${each.chartId}`,
                each.objects,
            ];
        });
        this.setState(state);
    }
    onDrawCompleteChart1(trends_1) {
        console.log(trends_1);
        this.setState({
            enableTrendLine: false,
            trends_1
        });
    }
    onKeyPress(e) {
        const keyCode = e.which;
        console.log(keyCode);
        switch (keyCode) {
            case 46: { // DEL
                const trends_1 = this.state.trends_1
                    .filter(each => !each.selected);
                const trends_2 = this.state.trends_2
                    .filter(each => !each.selected);
                const trends_3 = this.state.trends_3
                    .filter(each => !each.selected);

                this.canvasNode.cancelDrag();
                this.setState({
                    trends_1,
                    trends_2,
                    trends_3,
                });
                break;
            }
            case 68:   // D - Draw trendline
            case 69: { // E - Enable trendline
                this.setState({
                    enableTrendLine: true
                });
                break;
            }
            default: break;
        }
    }

    addPattern(pattern) {
        let trends_1 = [];
        let middleLine1, middleLine2;

        // Assume `this.props.data` contains your stock data array
        const stockData = this.props.data;

        console.log(stockData);

        switch (pattern) {
            case "Ascending Triangle":
                // Define your specific pattern logic for Pattern1
                trends_1 = [
                    { start: [stockData.length - 100, stockData[stockData.length - 50].close], end: [stockData.length - 20, stockData[stockData.length - 50].close], appearance: { stroke: "green" }, type: "XLINE" },
                    { start: [stockData.length - 100, stockData[stockData.length - 50].close / 1.2], end: [stockData.length - 20, stockData[stockData.length - 50].close], appearance: { stroke: "green" }, type: "XLINE" }
                ];
                break;
            case "Triple Top":
                // Define your specific pattern logic for Pattern2
                // Example: adding another line
                trends_1 = [
                    { start: [stockData.length - 100, stockData[stockData.length - 50].close], end: [stockData.length - 20, stockData[stockData.length - 50].close], appearance: { stroke: "green" }, type: "XLINE" },
                    { start: [stockData.length - 100, stockData[stockData.length - 50].close / 1.05], end: [stockData.length - 20, stockData[stockData.length - 50].close / 1.05], appearance: { stroke: "green" }, type: "XLINE" }
                ];
                break;
            case "Double Bottom":
                // Define your specific pattern logic for Pattern2
                // Example: adding another line
                trends_1 = [
                    { start: [stockData.length - 100, stockData[stockData.length - 50].close / 1.05], end: [stockData.length - 20, stockData[stockData.length - 50].close / 1.05], appearance: { stroke: "green" }, type: "XLINE" },
                    { start: [stockData.length - 100, stockData[stockData.length - 50].close / 1.10], end: [stockData.length - 20, stockData[stockData.length - 50].close / 1.10], appearance: { stroke: "green" }, type: "XLINE" }
                ];
                break;

            case "Head and Shoulders":
                // Define your specific pattern logic for Pattern2
                // Example: adding another line
                trends_1 = [
                    { start: [stockData.length - 100, stockData[stockData.length - 50].close / 1.05], end: [stockData.length - 20, stockData[stockData.length - 50].close / 1.05], appearance: { stroke: "green" }, type: "XLINE" },
                    { start: [stockData.length - 100, stockData[stockData.length - 50].close / 1.10], end: [stockData.length - 20, stockData[stockData.length - 50].close / 1.10], appearance: { stroke: "green" }, type: "XLINE" },
                    { start: [stockData.length - 100, stockData[stockData.length - 50].close / 1.15], end: [stockData.length - 20, stockData[stockData.length - 50].close / 1.12], appearance: { stroke: "green" }, type: "XLINE" }
                ];
                break;

            case "Bear Flag":
                // Define your specific pattern logic for Pattern2
                // Example: adding another line
                trends_1 = [
                    { start: [stockData.length - 70, stockData[stockData.length - 50].close / 1.05], end: [stockData.length - 60, stockData[stockData.length - 50].close / 1.25], appearance: { stroke: "green" }, type: "XLINE" },
                    { start: [stockData.length - 50, stockData[stockData.length - 50].close / 1.05], end: [stockData.length - 40, stockData[stockData.length - 50].close / 1.25], appearance: { stroke: "green" }, type: "XLINE" },
                    { start: [stockData.length - 30, stockData[stockData.length - 50].close / 1.05], end: [stockData.length - 20, stockData[stockData.length - 50].close / 1.25], appearance: { stroke: "green" }, type: "XLINE" }
                ];
                break;

            case "Bull Flag":
                // Define your specific pattern logic for Pattern2
                // Example: adding another line
                trends_1 = [
                    { start: [stockData.length - 60, stockData[stockData.length - 50].close / 1.15], end: [stockData.length - 50, stockData[stockData.length - 50].close], appearance: { stroke: "green" }, type: "XLINE" },
                    { start: [stockData.length - 40, stockData[stockData.length - 50].close / 1.15], end: [stockData.length - 30, stockData[stockData.length - 50].close], appearance: { stroke: "green" }, type: "XLINE" },
                ];
                break;

            default:
                break;
        }

        // Update component state
        this.setState({
            enableTrendLine: false,
            trends_1
        });
    }

    render() {
        const ema26 = ema()
            .id(0)
            .options({ windowSize: 26 })
            .merge((d, c) => { d.ema26 = c; })
            .accessor(d => d.ema26);

        const ema12 = ema()
            .id(1)
            .options({ windowSize: 12 })
            .merge((d, c) => { d.ema12 = c; })
            .accessor(d => d.ema12);

        const macdCalculator = macd()
            .options({
                fast: 12,
                slow: 26,
                signal: 9,
            })
            .merge((d, c) => { d.macd = c; })
            .accessor(d => d.macd);

        const { type, data: initialData, width, ratio } = this.props;

        const calculatedData = macdCalculator(ema12(ema26(initialData)));
        const xScaleProvider = discontinuousTimeScaleProvider
            .inputDateAccessor(d => d.date);
        const {
            data,
            xScale,
            xAccessor,
            displayXAccessor,
        } = xScaleProvider(calculatedData);

        const start = xAccessor(last(data));
        const end = xAccessor(data[Math.max(0, data.length - 150)]);
        const xExtents = [start, end];

        return (
            <div>
                <ChartCanvas ref={this.saveCanvasNode}
                    height={600}
                    width={width}
                    ratio={ratio}
                    margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
                    type={type}
                    seriesName="MSFT"
                    data={data}
                    xScale={xScale}
                    xAccessor={xAccessor}
                    displayXAccessor={displayXAccessor}
                    xExtents={xExtents}
                >
                    <Chart id={1} height={400}
                        yExtents={[d => [d.high, d.low], ema26.accessor(), ema12.accessor()]}
                        padding={{ top: 10, bottom: 60 }}
                    >
                        <XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
                        <YAxis axisAt="right" orient="right" ticks={5} />
                        <MouseCoordinateY
                            at="right"
                            orient="right"
                            displayFormat={format(".2f")} />

                        <CandlestickSeries />

                        <EdgeIndicator itemType="last" orient="right" edgeAt="right"
                            yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />

                        <OHLCTooltip origin={[-40, 0]} />
                        <TrendLine
                            ref={this.saveInteractiveNodes("Trendline", 1)}
                            enabled={this.state.enableTrendLine}
                            type="RAY"
                            snap={false}
                            snapTo={d => [d.high, d.low]}
                            onStart={() => console.log("START")}
                            onComplete={this.onDrawCompleteChart1}
                            trends={this.state.trends_1}
                            linesVisibleRange={xExtents}
                        />
                    </Chart>
                    <Chart id={2} height={150}
                        yExtents={[d => d.volume]}
                        origin={(w, h) => [0, h - 300]}
                    >
                        <YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")} />

                        <MouseCoordinateY
                            at="left"
                            orient="left"
                            displayFormat={format(".4s")} />

                        <BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
                    </Chart>
                    <Chart id={3} height={150}
                        yExtents={macdCalculator.accessor()}
                        origin={(w, h) => [0, h - 150]} padding={{ top: 10, bottom: 10 }}
                    >
                        <XAxis axisAt="bottom" orient="bottom" />
                        <YAxis axisAt="right" orient="right" ticks={2} />

                        <MouseCoordinateX
                            at="bottom"
                            orient="bottom"
                            displayFormat={timeFormat("%Y-%m-%d")} />
                        <MouseCoordinateY
                            at="right"
                            orient="right"
                            displayFormat={format(".2f")} />
                    </Chart>
                    <CrossHairCursor />
                    <DrawingObjectSelector
                        enabled={!this.state.enableTrendLine}
                        getInteractiveNodes={this.getInteractiveNodes}
                        drawingObjectMap={{
                            Trendline: "trends"
                        }}
                        onSelect={this.handleSelection}
                    />
                </ChartCanvas>
            </div>

        );
    }
}

CandlestickChart.propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    ratio: PropTypes.number.isRequired,
    type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandlestickChart.defaultProps = {
    type: "svg",
};

const CandleStickChartWithInteractiveIndicator = fitWidth(CandlestickChart);

export default CandleStickChartWithInteractiveIndicator;