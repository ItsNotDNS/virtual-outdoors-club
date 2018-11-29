import { expect } from "chai";
import sinon from "sinon";
import axiosAuth, { setAxiosWithAuth } from "../../../../constants/axiosConfig";
import { LoginStore } from "react/login/LoginStore";
import Cookies from "universal-cookie";

const sandbox = sinon.createSandbox(), cookies = new Cookies();
let postStub, store, clock;

describe("LoginStore tests", () => {

    beforeEach(() => {
        postStub = sandbox.stub(axiosAuth.axiosSingleton, "post");
        store = new LoginStore(),
        clock = sandbox.useFakeTimers();
        cookies.remove("token");
        cookies.remove("refresh");
    });

    afterEach(() => {
        cookies.remove("token");
        cookies.remove("refresh");
        sandbox.restore();
    });

    it("should handle onChange events", () => {
        const event = {
                target: {
                    name: "name",
                    value: "value"
                }
            };
        store.onUpdateFields(event);
        expect(store.state.name).to.be.equal("value");
    });

    it("should handle incorrect login submissions - error path", () => {
        const error = { response: { data: { message: "this is an error message" } } };
        postStub.returns(Promise.reject(error));

        // no token should be generated after stubbing the post request
        return store.onHandleSubmit().then(() => {
            expect(store.state.errorMessage).to.equal(error.response.data.message);
            expect(store.state.error).to.be.true;
        });
    });

    it("should handle correct login submissions - success path", () => {
        const mockData = { data: { access: "accessToken", refresh: "refreshToken" } };

        postStub.returns(Promise.resolve(mockData));
        return store.onHandleSubmit().then(() => {
            expect(store.state.isAuthenticated).to.be.true;
            expect(store.state.error).to.be.false;
            
            // clear tokens from browser
            cookies.remove("token");
            cookies.remove("refresh");

            expect(cookies.get("token")).to.not.exist;
            expect(cookies.get("refresh")).to.not.exist;
        });
    });

    it("should clear cookies and reset state on logout", () => {
        store.onHandleLogout();
        // confirm the state has been changed
        expect(store.state).to.deep.equal({
            error: false,
            errorMessage: "",
            name: "",
            password: "",
            isAuthenticated: false,
        });
        expect(cookies.get("token")).to.not.exist;
        expect(cookies.get("refresh")).to.not.exist;
    });

    it("onRefreshToken - error path", () => {
        const mockData = { data: { access: "accessToken", refresh: "refreshToken" } },
            mockCookie = { access: "accessMock", refresh: "refreshMock" },
            error = { response: { data: { message: "this is an error message" } } };

        postStub.returns(Promise.reject(error));

        cookies.set("refresh", "refreshToken");

        return store.onRefreshToken().then(() => {
            expect(store.state.errorMessage).to.equal(error.response.data.message);
            expect(store.state.error).to.be.true;
        });
    });

    it("onRefreshToken - success path", () => {
        const data = Promise.resolve({ data: { access: "newAccess" } });
        cookies.set("refresh", "refreshToken");

        postStub.returns(data);
        return store.onRefreshToken().then(() => {
            // onRefreshToken should set the new token already with access
            expect(store.state.errorMessage).to.equal("");
            expect(cookies.get("token")).to.equal("newAccess");
            expect(store.state.error).to.be.false;
        });
    });

    it("throws the generic error - error path", () => {
        const error = { response: "this is an error message" };

        postStub.returns(Promise.reject(error));

        cookies.set("refresh", "refreshToken");
        cookies.set("token", "accessToken");

        return store.onRefreshToken().then(() => {
            expect(store.state.errorMessage).to.equal("An unexpected error occurred, try again later.");
            expect(store.state.error).to.be.true;
        });
    });

    it("properly calls componentDidMount when there is a cookie", () => {
        const refreshStub = sandbox.stub(LoginStore.prototype, "onRefreshToken");
        cookies.set("refresh", "whack");
        store.componentDidMount();
        expect(refreshStub.calledOnce).to.be.true;
    });

    it("properly calls componentDidMount when there is a cookie", () => {
        const refreshStub = sandbox.stub(LoginStore.prototype, "onRefreshToken");
        store.componentDidMount();
        expect(refreshStub.calledOnce).to.be.false;
    });

    it("should return a state that is uthenticated if cookies are there ", () => {
        cookies.set("refresh", "refreshToken");
        cookies.set("token", "accessToken");

        const expected = {
                error: false,
                errorMessage: "",
                name: "",
                password: "",
                isAuthenticated: true
            },
            defaultResult = new LoginStore;

        expect(defaultResult.state).to.deep.equal(expected);
    })
});
