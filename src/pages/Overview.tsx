import { useContext } from "react";
import { UserContext } from "../components/Context";
import Layout from "../components/Layout";

function Overview() {
    const { user } = useContext(UserContext);
    return (
        <Layout>
            <main>
                <h1>Overview</h1>
                <h2>{user?.name}</h2>
            </main>
        </Layout>
    );
}

export default Overview;
