# Surya Pratap Dubey

I’m Surya, a computer science graduate interested in how mobile networks handle failures. In my LTE lab, I used Python to summarize 10 simulated attach attempts, then walked through what I’d check when two of them timed out during authentication.

## [LTE Core Operations Lab](https://github.com/avidubey06/lte-core-operations-lab#incident-walkthrough)

I’d match transaction IDs and timestamps between the MME and HSS to see where the exchange stopped. The event trace shows a successful request and response alongside an attempt where the MME recorded a timeout.

[Compare a successful attach and a timeout](https://github.com/avidubey06/lte-core-operations-lab#compare-a-successful-attach-and-a-timeout) · [View the event CSV](https://github.com/avidubey06/lte-core-operations-lab/blob/main/attach-events.csv) · [Read the analyzer](https://github.com/avidubey06/lte-core-operations-lab/blob/main/triage.py) · [Inspect the sample CSV](https://github.com/avidubey06/lte-core-operations-lab/blob/main/attempts.csv)

## [SOC Alert Triage Lab](https://github.com/avidubey06/soc-alert-triage-lab#case-review)

Three failed sign-ins followed by a success trigger one alert in the sample. I’d keep it open for review and look for MFA or device records before escalating. The [detection benchmark](https://github.com/avidubey06/soc-alert-triage-lab/blob/main/benchmarks/README.md#detection-engineering-benchmark) shows the trade-off. On 240 synthetic holdout cases, the tuned rule cut false positives from 40 to 20. Both rule settings missed all 40 distributed-source cases, and the tuned rule missed eight rapid cases.

## Background

B.Tech in Computer Science, Baderia Global Institute of Engineering and Management. My networking coursework included IP subnetting, VLANs and Wireshark packet analysis. I’ve also studied UMTS and GSM/GPRS fundamentals.

[LinkedIn](https://www.linkedin.com/in/surya-pratap-dubey-7ba104142/) · [Portfolio](https://avidubey06.github.io/avidubey06/)
