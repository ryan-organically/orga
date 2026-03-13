# GoDaddy DNS Configuration Guide
## Point organicallyseo.com to GitHub Pages

---

## 🎯 Overview

You'll configure DNS records to point your GoDaddy domain to GitHub Pages servers.

**What you're doing**:
- **Apex domain** (`organicallyseo.com`) → GitHub Pages IPs
- **WWW subdomain** (`www.organicallyseo.com`) → GitHub Pages URL

**Time to propagate**: Usually 10-30 minutes, up to 48 hours maximum

---

## 📋 Prerequisites

- [x] GitHub Pages is enabled and working (test at `username.github.io/repo-name`)
- [x] CNAME file is in your repository root
- [ ] Access to GoDaddy account with domain `organicallyseo.com`

---

## 🔧 Step 1: Access GoDaddy DNS Management

1. Log in to **GoDaddy.com**
2. Click **My Products** (top right)
3. Find **organicallyseo.com** in your domains list
4. Click **DNS** button (or the three dots → **Manage DNS**)

You should see the DNS Management page with existing records.

---

## 🗑️ Step 2: Remove Conflicting Records (If Webflow)

**If you're currently using Webflow**, you'll have these records:

### Delete These Records:
- **A Record** pointing to Webflow IP (like `75.2.70.75`)
- **CNAME Record** for `www` pointing to Webflow (`proxy-ssl.webflow.com`)

**How to Delete**:
1. Find the record in the list
2. Click the **pencil icon** or **three dots** → **Delete**
3. Confirm deletion

**⚠️ WARNING**: Your website will go down briefly until GitHub Pages DNS is configured!

---

## ➕ Step 3: Add GitHub Pages A Records

Add **FOUR** A records (for redundancy and speed):

### A Record #1
```
Type:     A
Name:     @ (represents your root domain)
Value:    185.199.108.153
TTL:      600 (or 1 hour / default)
```

### A Record #2
```
Type:     A
Name:     @
Value:    185.199.109.153
TTL:      600
```

### A Record #3
```
Type:     A
Name:     @
Value:    185.199.110.153
TTL:      600
```

### A Record #4
```
Type:     A
Name:     @
Value:    185.199.111.153
TTL:      600
```

**How to Add**:
1. Click **Add** or **Add Record** button
2. Select **Type**: `A`
3. **Name**: `@` (this means root domain)
4. **Value**: Paste the IP address
5. **TTL**: `600` or leave default
6. Click **Save**
7. Repeat for all 4 IP addresses

---

## 🔗 Step 4: Add WWW CNAME Record

Add a CNAME record to redirect `www.organicallyseo.com` to your main domain:

### CNAME Record
```
Type:     CNAME
Name:     www
Value:    YOUR-GITHUB-USERNAME.github.io
TTL:      1 Hour (or 600)
```

**Replace `YOUR-GITHUB-USERNAME`** with your actual GitHub username!

**Example**:
- If your GitHub username is `ryan-organically`
- Value should be: `ryan-organically.github.io` (no http://, no trailing slash)

**How to Add**:
1. Click **Add** button
2. Select **Type**: `CNAME`
3. **Name**: `www`
4. **Value**: `YOUR-USERNAME.github.io`
5. **TTL**: `1 Hour` or `600`
6. Click **Save**

---

## ✅ Step 5: Verify Configuration

### Your DNS Records Should Look Like This:

| Type  | Name | Value                     | TTL      |
|-------|------|---------------------------|----------|
| A     | @    | 185.199.108.153          | 600      |
| A     | @    | 185.199.109.153          | 600      |
| A     | @    | 185.199.110.153          | 600      |
| A     | @    | 185.199.111.153          | 600      |
| CNAME | www  | YOUR-USERNAME.github.io  | 1 Hour   |

### Other Records to Keep:
- **TXT records** (for domain verification, email, etc.) - Keep these!
- **MX records** (for email) - Keep these!
- **NS records** (nameservers) - Don't touch these!

**Only delete/modify A and CNAME records** related to your website hosting.

---

## 🕐 Step 6: Wait for DNS Propagation

### Expected Timeline:
- **10-30 minutes**: Most DNS servers updated
- **1-2 hours**: Usually fully propagated
- **24-48 hours**: Maximum time (rare)

### Check Propagation Status:

**Option 1**: Use DNS Checker
1. Go to https://dnschecker.org
2. Enter: `organicallyseo.com`
3. Select: `A` record type
4. Click **Search**
5. Look for green checkmarks showing GitHub IPs

**Option 2**: Command Line
```bash
# Check A records
nslookup organicallyseo.com

# Should show GitHub Pages IPs:
# 185.199.108.153
# 185.199.109.153
# 185.199.110.153
# 185.199.111.153

# Check CNAME for www
nslookup www.organicallyseo.com

# Should show: www.organicallyseo.com is an alias for YOUR-USERNAME.github.io
```

---

## 🔒 Step 7: Enable HTTPS on GitHub Pages

**After DNS is fully propagated** (wait at least 30 minutes):

1. Go to your GitHub repository
2. **Settings** → **Pages**
3. Under **Custom domain**: Should show `organicallyseo.com` ✅
4. **Check the box**: ✅ **Enforce HTTPS**

**Note**: SSL certificate provisioning can take up to 24 hours.

### If HTTPS Checkbox is Grayed Out:
- DNS not fully propagated yet - wait longer
- CNAME file missing from repo - check it exists
- Domain verification failed - re-enter domain in GitHub settings

---

## 🧪 Testing Your Setup

### Test These URLs (After DNS Propagates):

```bash
# Root domain (should work)
http://organicallyseo.com
https://organicallyseo.com

# WWW subdomain (should redirect to root)
http://www.organicallyseo.com
https://www.organicallyseo.com

# Pretty URLs (should work without .html)
https://organicallyseo.com/seo
https://organicallyseo.com/web-design
https://organicallyseo.com/blog
```

### What to Expect:
1. First, HTTP will work (`http://organicallyseo.com`)
2. Then HTTPS will work after GitHub provisions SSL certificate
3. `www` subdomain should redirect to non-www (or vice versa)

---

## 🐛 Troubleshooting

### "This site can't be reached" or DNS errors

**Causes**:
- DNS not propagated yet → **Wait 30-60 more minutes**
- A records typed wrong → **Double-check IPs match exactly**
- Old DNS cached → **Clear browser cache, try incognito mode**

**Solutions**:
```bash
# Flush DNS cache (Windows)
ipconfig /flushdns

# Flush DNS cache (Mac)
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Flush DNS cache (Linux)
sudo systemd-resolve --flush-caches
```

### "Not Secure" Warning (No HTTPS)

**Causes**:
- SSL certificate not provisioned yet → **Wait up to 24 hours**
- DNS not fully propagated → **Check dnschecker.org**
- "Enforce HTTPS" not enabled → **Enable in GitHub Pages settings**

**Solution**: Be patient! SSL can take time. Use HTTP temporarily.

### WWW Not Working

**Check**:
- CNAME record exists for `www`
- Value is `YOUR-USERNAME.github.io` (not organicallyseo.com)
- No typos in GitHub username

### GitHub Pages Shows Wrong Site

**Check**:
- CNAME file in repository contains only: `organicallyseo.com`
- No extra lines, spaces, or `www.` prefix
- File is named exactly `CNAME` (uppercase, no extension)

---

## 📊 DNS Configuration Checklist

- [ ] Logged into GoDaddy DNS Management
- [ ] Removed old Webflow/hosting A records
- [ ] Removed old Webflow/hosting CNAME record for www
- [ ] Added 4 A records (185.199.108.153, .109., .110., .111.)
- [ ] Added CNAME record for www → YOUR-USERNAME.github.io
- [ ] Saved all changes in GoDaddy
- [ ] Waited 30+ minutes for propagation
- [ ] Tested organicallyseo.com in browser (HTTP works)
- [ ] Enabled "Enforce HTTPS" in GitHub Pages settings
- [ ] Tested https://organicallyseo.com (HTTPS works)
- [ ] Verified www.organicallyseo.com redirects properly

---

## 🔄 Reverting to Webflow (Emergency)

If something goes wrong and you need to go back to Webflow temporarily:

1. GoDaddy DNS: Remove GitHub A records
2. Add back Webflow A record: `75.2.70.75`
3. Add back Webflow CNAME for www: `proxy-ssl.webflow.com`
4. Wait 10-30 minutes for DNS to propagate

**Note**: Only do this if GitHub Pages deployment fails completely!

---

## 📞 Additional Resources

**GitHub Pages Custom Domain Docs**:
https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

**GoDaddy DNS Help**:
https://www.godaddy.com/help/manage-dns-records-680

**DNS Propagation Checker**:
https://dnschecker.org

**SSL Certificate Status**:
https://www.ssllabs.com/ssltest/

---

## 🎉 Success Criteria

Your setup is complete when:

✅ `organicallyseo.com` loads your GitHub Pages site
✅ `www.organicallyseo.com` redirects or works
✅ HTTPS works (green padlock in browser)
✅ Pretty URLs work (`/seo` instead of `/seo.html`)
✅ All images, CSS, and JS load correctly
✅ No mixed content warnings

---

**Last Updated**: 2025-11-07
**Status**: Ready for DNS configuration
