#!/usr/bin/env python3
"""
Direct client for the blender-mcp addon socket.

The MCP server is not connected in this session (it was installed mid-session,
and MCP servers attach at startup). The addon exposes the same JSON socket the
server would drive, so we talk to Blender directly.

  python3 bl.py run script.py     # execute a Python file inside Blender
  python3 bl.py info              # scene summary
"""
import json
import socket
import sys

HOST, PORT = "localhost", 9876


def send(payload, timeout=300):
    """
    Accumulate until the buffer parses as JSON.

    The addon can split a reply across several TCP segments. An earlier version
    returned from inside the read loop on the FIRST chunk that happened to parse
    and silently produced no output when it did not — commands appeared to run
    with no result at all.
    """
    s = socket.create_connection((HOST, PORT), timeout=timeout)
    s.settimeout(timeout)
    buf = b""
    try:
        s.sendall(json.dumps(payload).encode())
        while True:
            try:
                chunk = s.recv(65536)
            except socket.timeout:
                break
            if not chunk:
                break
            buf += chunk
            try:
                return json.loads(buf.decode())
            except json.JSONDecodeError:
                continue
    finally:
        s.close()

    raise RuntimeError(f"no parseable response ({len(buf)} bytes)")


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "info"

    if cmd == "info":
        r = send({"type": "get_scene_info", "params": {}})
        print(json.dumps(r.get("result", r), indent=2)[:2000])
        return

    if cmd == "run":
        code = open(sys.argv[2]).read()
        r = send({"type": "execute_code", "params": {"code": code}})

        if r.get("status") != "success":
            print("ERROR:", json.dumps(r)[:3000])
            sys.exit(1)

        # Unwrap {'executed': True, 'result': '...'} — the printed output of the
        # script lives in the inner 'result'.
        out = r.get("result", {})
        text = out.get("result", out) if isinstance(out, dict) else out
        print(str(text).rstrip() or "(no output)")
        return

    print(__doc__)


if __name__ == "__main__":
    main()
