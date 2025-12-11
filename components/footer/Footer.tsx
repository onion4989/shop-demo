import FooterInfo from "@components/footer/FooterInfo";
import FooterImages from "@components/footer/FooterImages";

export default function Footer() {
  return (
    <footer className="w-[100%] lg:w-[1200px] m-auto">
      <FooterInfo />
      <FooterImages />
    </footer>
  );
}
