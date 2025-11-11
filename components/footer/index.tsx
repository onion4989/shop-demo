import FooterInfo from "@/app/components/footer/footer-info";
import FooterImages from "@/app/components/footer/footer-images";

export default function Footer() {
  return (
    <footer className="w-[100%] lg:w-[1200px] m-auto">
      <FooterInfo />
      <FooterImages />
    </footer>
  );
}
