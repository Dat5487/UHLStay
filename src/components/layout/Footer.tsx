import footerImg1 from "/footer/footer_01.png"
import footerImg2 from "/footer/footer_02.png"
import footerImg3 from "/footer/footer_03.png"
import footerImg4 from "/footer/footer_04.png"
import footerImg0 from "/footer/footer_00.png"
import {Avatar} from 'antd';

const footerImageList = [
    { id: 0, src: footerImg0, alt: "Logo đối tác 0", name: "TS. Phạm Thanh Huyền"},
    { id: 1, src: footerImg1, alt: 'Logo đối tác 1', name: "Nguyễn Khánh Hạ"},
    { id: 2, src: footerImg2, alt: 'Logo đối tác 2', name: "Nguyễn Hoàng Minh"},
    { id: 3, src: footerImg3, alt: 'Logo đối tác 3', name: "Trần Thị Kim Ngân"},
    { id: 4, src: footerImg4, alt: 'Logo đối tác 4', name: "Trần Thành Đạt"}
];



export default function Footer() {
    return (
        <footer className="bg-[#3397E3] pt-8 pb-8">
            <div className="container mx-auto px-4 ">
                <div className="text-center !text-grey-500">
                    <h2 className={"text-center !text-white text-2xl pb-12"}>BẢN QUYỀN THUỘC VỀ</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-16 justify-center">
                        {footerImageList.map(image => (
                            <div>
                                <Avatar size={168} src={image.src} alt={image.alt} shape={"circle"} draggable={true} className="mx-auto"/>
                                <p className="text-lg md:text-xl pt-2 text-center font-bold text-white">{image.name}</p>
                            </div>
                        ))}
                    </div>
                    <hr className="my-4 border-black"/>
                    <p>© {new Date().getFullYear()} Unistay - Hệ thống phòng trọ sinh viên | Trường Đại học Hạ Long</p>
                </div>

            </div>
        </footer>
    );
}