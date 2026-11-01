import { commonComponents } from "./common";
import { NeuralNet } from "../../features/neural/NeuralNet";
import { ActivationChart, LossCurves } from "../../features/neural/Charts";
import { GradientDescent, Perceptron } from "../../features/neural/Learning";
export const mdxComponents = { ...commonComponents, NeuralNet, ActivationChart, LossCurves, GradientDescent, Perceptron };
