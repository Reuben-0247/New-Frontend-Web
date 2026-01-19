declare module "*.scss";
declare module "*.sass";
declare module "*.css";
declare module "*.swiper/css/pagination";
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
