import {Outlet} from "react-router-dom";

const SplitLayout = () => {
    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default SplitLayout;